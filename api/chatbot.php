<?php
/**
 * OSAS Chatbot API - Hybrid System (Rule-based + AI Fallback)
 * Handles chatbot requests and returns appropriate responses
 */

// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Start output buffering to catch any errors
ob_start();

// CORS Configuration
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Include database connection
require_once __DIR__ . '/../config/db_connect.php';

// Load chatbot configuration if available
$config = [];
$configPath = __DIR__ . '/../config/chatbot_config.php';
if (file_exists($configPath)) {
    $loadedConfig = require $configPath;
    if (is_array($loadedConfig)) {
        $config = $loadedConfig;
    }
}

// Get OpenAI API key from config or environment
$openaiApiKey = $config['openai_api_key'] ?? getenv('OPENAI_API_KEY') ?? '';

// Rate limiting (simple in-memory, use Redis in production)
session_start();
$rateLimitKey = 'chatbot_rate_limit';
$rateLimitWindow = $config['rate_limit_window'] ?? 60; // 60 seconds
$rateLimitMax = $config['rate_limit_max'] ?? 20; // 20 requests per window

if (!isset($_SESSION[$rateLimitKey])) {
    $_SESSION[$rateLimitKey] = ['count' => 0, 'reset' => time() + $rateLimitWindow];
}

$rateLimit = &$_SESSION[$rateLimitKey];
if (time() > $rateLimit['reset']) {
    $rateLimit = ['count' => 0, 'reset' => time() + $rateLimitWindow];
}

if ($rateLimit['count'] >= $rateLimitMax) {
    http_response_code(429);
    echo json_encode(['success' => false, 'error' => 'Rate limit exceeded. Please try again later.']);
    exit();
}

$rateLimit['count']++;

// Get user ID from session if available
$userId = $_SESSION['user_id'] ?? null;
$sessionId = session_id();

// Get and validate input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit();
}

$message = trim($data['message'] ?? '');
$history = $data['history'] ?? [];

// Validate message
if (empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Message cannot be empty']);
    exit();
}

if (strlen($message) > 500) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Message too long']);
    exit();
}

// Sanitize message (but keep original for database)
$messageOriginal = $message;
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Get database statistics
$dbStats = getDatabaseStats($messageOriginal, $conn);

// Get or create conversation
$conversationId = getOrCreateConversation($conn, $userId, $sessionId);

// Clear output buffer
ob_clean();

// Process the message
try {
    $responseData = handleChat($messageOriginal, $history, $dbStats, $conn, $openaiApiKey, $conversationId);
    $response = $responseData['response'];
    $source = $responseData['source'] ?? 'default';
    
    // Store messages in database
    storeMessage($conn, $conversationId, 'user', $messageOriginal, 'user');
    storeMessage($conn, $conversationId, 'assistant', $response, $source);
    
    echo json_encode(['success' => true, 'response' => $response]);
} catch (Exception $e) {
    error_log('Chatbot error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'An error occurred. Please try again.']);
}

/**
 * Get or create conversation in database
 */
function getOrCreateConversation($conn, $userId, $sessionId) {
    if ($conn->connect_error) {
        return null;
    }
    
    // Try to get existing conversation for this session
    $stmt = $conn->prepare("SELECT id FROM chatbot_conversations WHERE session_id = ? ORDER BY updated_at DESC LIMIT 1");
    if ($stmt) {
        $stmt->bind_param("s", $sessionId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            // Update conversation timestamp
            $updateStmt = $conn->prepare("UPDATE chatbot_conversations SET updated_at = NOW() WHERE id = ?");
            $updateStmt->bind_param("i", $row['id']);
            $updateStmt->execute();
            $updateStmt->close();
            $stmt->close();
            return $row['id'];
        }
        $stmt->close();
    }
    
    // Create new conversation
    $stmt = $conn->prepare("INSERT INTO chatbot_conversations (user_id, session_id) VALUES (?, ?)");
    if ($stmt) {
        $stmt->bind_param("is", $userId, $sessionId);
        $stmt->execute();
        $conversationId = $conn->insert_id;
        $stmt->close();
        return $conversationId;
    }
    
    return null;
}

/**
 * Store message in database
 */
function storeMessage($conn, $conversationId, $role, $message, $source) {
    if ($conn->connect_error || !$conversationId) {
        return;
    }
    
    $stmt = $conn->prepare("INSERT INTO chatbot_messages (conversation_id, role, message, response_source) VALUES (?, ?, ?, ?)");
    if ($stmt) {
        $stmt->bind_param("isss", $conversationId, $role, $message, $source);
        $stmt->execute();
        $stmt->close();
    }
}

/**
 * Get conversation history from database
 */
function getConversationHistory($conn, $conversationId, $limit = 10) {
    if ($conn->connect_error || !$conversationId) {
        return [];
    }
    
    $history = [];
    $stmt = $conn->prepare("SELECT role, message FROM chatbot_messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT ?");
    if ($stmt) {
        $stmt->bind_param("ii", $conversationId, $limit);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $history[] = [
                'role' => $row['role'] === 'assistant' ? 'assistant' : 'user',
                'content' => $row['message']
            ];
        }
        $stmt->close();
        return array_reverse($history); // Reverse to get chronological order
    }
    
    return [];
}

/**
 * Main chat handler - tries rule-based first, then AI
 */
function handleChat($message, $history, $dbStats, $conn, $openaiApiKey, $conversationId = null) {
    // Get database history if conversation exists
    if ($conversationId) {
        $dbHistory = getConversationHistory($conn, $conversationId, 10);
        if (!empty($dbHistory)) {
            $history = array_merge($dbHistory, $history);
            // Remove duplicates and keep last 10
            $history = array_slice($history, -10);
        }
    }
    
    // Try rule-based response first
    $ruleResponse = getRuleBasedResponse($message, $dbStats);
    
    if ($ruleResponse !== null) {
        return ['response' => $ruleResponse, 'source' => 'rule-based'];
    }
    
    // Fallback to AI if available (prioritize AI for better responses)
    if (!empty($openaiApiKey)) {
        $aiResponse = getAIResponse($message, $history, $dbStats, $openaiApiKey);
        if ($aiResponse !== null && !empty(trim($aiResponse))) {
            return ['response' => $aiResponse, 'source' => 'ai'];
        }
    }
    
    // Default response
    return ['response' => getDefaultResponse($dbStats), 'source' => 'default'];
}

/**
 * Get database statistics based on message context
 */
function getDatabaseStats($message, $conn) {
    $stats = [
        'total_students' => 0,
        'total_violations' => 0,
        'total_departments' => 0,
        'total_sections' => 0,
        'recent_violations' => 0
    ];
    
    if ($conn->connect_error) {
        return $stats;
    }
    
    $messageLower = strtolower($message);
    
    // Only fetch stats if message seems to ask for them
    if (strpos($messageLower, 'student') !== false || 
        strpos($messageLower, 'how many') !== false ||
        strpos($messageLower, 'count') !== false ||
        strpos($messageLower, 'statistic') !== false ||
        strpos($messageLower, 'data') !== false) {
        
        // Get total students
        $result = $conn->query("SELECT COUNT(*) as count FROM students");
        if ($result && $row = $result->fetch_assoc()) {
            $stats['total_students'] = (int)$row['count'];
        }
        
        // Get total violations
        $result = $conn->query("SELECT COUNT(*) as count FROM violations");
        if ($result && $row = $result->fetch_assoc()) {
            $stats['total_violations'] = (int)$row['count'];
        }
        
        // Get total departments
        $result = $conn->query("SELECT COUNT(*) as count FROM departments");
        if ($result && $row = $result->fetch_assoc()) {
            $stats['total_departments'] = (int)$row['count'];
        }
        
        // Get total sections
        $result = $conn->query("SELECT COUNT(*) as count FROM sections");
        if ($result && $row = $result->fetch_assoc()) {
            $stats['total_sections'] = (int)$row['count'];
        }
        
        // Get recent violations (last 30 days)
        $result = $conn->query("SELECT COUNT(*) as count FROM violations WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)");
        if ($result && $row = $result->fetch_assoc()) {
            $stats['recent_violations'] = (int)$row['count'];
        }
    }
    
    return $stats;
}

/**
 * Rule-based response handler
 */
function getRuleBasedResponse($message, $dbStats) {
    $messageLower = strtolower(trim($message));
    
    // Greetings
    if (preg_match('/\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/i', $message)) {
        return "Hello! I'm your OSAS Assistant. How can I help you today?";
    }
    
    // Student count queries
    if (preg_match('/\b(how many|count|total|number of)\s+students?\b/i', $message)) {
        $count = $dbStats['total_students'];
        return "There are currently {$count} student" . ($count !== 1 ? 's' : '') . " in the OSAS system.";
    }
    
    // Violation queries
    if (preg_match('/\b(how many|count|total|number of)\s+violations?\b/i', $message)) {
        $count = $dbStats['total_violations'];
        $recent = $dbStats['recent_violations'];
        return "There are {$count} total violation" . ($count !== 1 ? 's' : '') . " recorded in the system. " . 
               ($recent > 0 ? "{$recent} violation" . ($recent !== 1 ? 's were' : ' was') . " recorded in the last 30 days." : "");
    }
    
    // Department queries
    if (preg_match('/\b(how many|count|total|number of)\s+departments?\b/i', $message)) {
        $count = $dbStats['total_departments'];
        return "There are {$count} department" . ($count !== 1 ? 's' : '') . " in the system.";
    }
    
    // Section queries
    if (preg_match('/\b(how many|count|total|number of)\s+sections?\b/i', $message)) {
        $count = $dbStats['total_sections'];
        return "There are {$count} section" . ($count !== 1 ? 's' : '') . " in the system.";
    }
    
    // Help requests
    if (preg_match('/\b(help|assist|support|guide|how to|how do)\b/i', $message)) {
        return "I can help you with:\n" .
               "• Checking student counts and statistics\n" .
               "• Viewing violation information\n" .
               "• Understanding the OSAS system features\n" .
               "• General questions about the system\n\n" .
               "What would you like to know?";
    }
    
    // System information
    if (preg_match('/\b(what is|tell me about|explain|information about)\s+(osas|system)\b/i', $message)) {
        return "The OSAS (Office of Student Affairs and Services) system helps manage:\n" .
               "• Student records and information\n" .
               "• Violation tracking and management\n" .
               "• Department and section organization\n" .
               "• Reports and analytics\n\n" .
               "Is there something specific you'd like to know?";
    }
    
    // No rule matched
    return null;
}

/**
 * AI-powered response using OpenAI GPT
 */
function getAIResponse($message, $history, $dbStats, $apiKey) {
    // Enhanced system context with more information
    $context = "You are a helpful and friendly AI assistant for the OSAS (Office of Student Affairs and Services) system. " .
               "Your role is to assist users with questions about the OSAS system, including student management, violations, departments, and sections.\n\n" .
               "Current System Statistics:\n" .
               "• Total Students: {$dbStats['total_students']}\n" .
               "• Total Violations: {$dbStats['total_violations']}\n" .
               "• Total Departments: {$dbStats['total_departments']}\n" .
               "• Total Sections: {$dbStats['total_sections']}\n" .
               "• Recent Violations (last 30 days): {$dbStats['recent_violations']}\n\n" .
               "Guidelines:\n" .
               "- Be conversational, friendly, and professional\n" .
               "- Keep responses concise (2-4 sentences typically)\n" .
               "- Use the statistics above when relevant to answer questions\n" .
               "- If asked about something outside OSAS scope, politely redirect to OSAS-related topics\n" .
               "- Always be helpful and encouraging\n" .
               "- Use natural language, avoid robotic responses";
    
    $messages = [
        ['role' => 'system', 'content' => $context]
    ];
    
    // Add conversation history (last 6 messages for context)
    foreach (array_slice($history, -6) as $msg) {
        if (isset($msg['role']) && isset($msg['content']) && !empty(trim($msg['content']))) {
            $role = $msg['role'] === 'assistant' ? 'assistant' : 'user';
            $messages[] = ['role' => $role, 'content' => trim($msg['content'])];
        }
    }
    
    // Add current message
    $messages[] = ['role' => 'user', 'content' => $message];
    
    // Get model from config or use default
    global $config;
    $model = $config['ai_model'] ?? 'gpt-3.5-turbo';
    $temperature = $config['ai_temperature'] ?? 0.8;
    $maxTokens = $config['ai_max_tokens'] ?? 300;
    
    $data = [
        'model' => $model,
        'messages' => $messages,
        'temperature' => $temperature,
        'max_tokens' => $maxTokens,
        'stream' => false
    ];
    
    $ch = curl_init('https://api.openai.com/v1/chat/completions');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey
        ],
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_TIMEOUT => 15,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_SSL_VERIFYPEER => true
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    $curlErrno = curl_errno($ch);
    curl_close($ch);
    
    if ($curlError || $curlErrno) {
        error_log('OpenAI CURL error: ' . $curlError . ' (Code: ' . $curlErrno . ')');
        return null;
    }
    
    if ($httpCode !== 200) {
        $errorData = json_decode($response, true);
        $errorMessage = $errorData['error']['message'] ?? 'Unknown error';
        error_log('OpenAI API error: HTTP ' . $httpCode . ' - ' . $errorMessage);
        
        if ($httpCode === 401) {
            return null; // Invalid API key, fall back to default
        }
        if ($httpCode === 429) {
            return "I'm currently experiencing high demand. Please try again in a moment.";
        }
        if ($httpCode === 500 || $httpCode === 503) {
            return "I'm having temporary issues. Please try again shortly.";
        }
        return null;
    }
    
    $result = json_decode($response, true);
    
    if (isset($result['choices'][0]['message']['content'])) {
        $aiResponse = trim($result['choices'][0]['message']['content']);
        // Clean up response
        $aiResponse = preg_replace('/\n{3,}/', "\n\n", $aiResponse); // Remove excessive newlines
        return $aiResponse;
    }
    
    return null;
}

/**
 * Default response when no rule matches and AI is unavailable
 */
function getDefaultResponse($dbStats) {
    $responses = [
        "I'm here to help with the OSAS system. Could you rephrase your question?",
        "I understand you're asking about the OSAS system. Can you provide more details?",
        "Let me help you with that. Could you clarify what you'd like to know?",
    ];
    
    $response = $responses[array_rand($responses)];
    
    // Add stats if available and relevant
    if ($dbStats['total_students'] > 0) {
        $response .= " I can tell you that there are {$dbStats['total_students']} students in the system.";
    }
    
    return $response;
}
