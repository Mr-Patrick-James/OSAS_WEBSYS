<?php
// api/students.php - API endpoint for Students CRUD operations

// Start output buffering to catch any errors/warnings
ob_start();

// Error reporting - disable display in production, enable logging
error_reporting(E_ALL);
// Set to false in production to hide errors from users
$isProduction = false; // Set to true when deploying to online host
ini_set('display_errors', $isProduction ? 0 : 1);
ini_set('log_errors', 1);

// Set JSON response header FIRST
header('Content-Type: application/json');

// Start session
@session_start();

// Function to output JSON error and exit
function outputError($message, $help = '') {
    ob_clean();
    echo json_encode([
        'status' => 'error',
        'message' => $message,
        'data' => [],
        'help' => $help
    ]);
    exit;
}

// Connect to database with error handling
try {
    // Use centralized database configuration
    require_once __DIR__ . '/../config/db_connect.php';
    
    // Check connection
    if ($conn->connect_error) {
        outputError(
            'Database connection failed: ' . $conn->connect_error,
            'Please check your database configuration. Make sure the database exists and credentials are correct in config/db_connect.php'
        );
    }
    
    // Set charset to UTF-8
    $conn->set_charset("utf8mb4");
} catch (Exception $e) {
    outputError(
        'Database connection error: ' . $e->getMessage(),
        'Please check your database configuration in config/db_connect.php'
    );
}

// Clear any output that might have been generated
ob_clean();

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Handle different actions
try {
    switch ($action) {
        case 'get':
            getStudents($conn);
            break;
        case 'add':
            addStudent($conn);
            break;
        case 'update':
            updateStudent($conn);
            break;
        case 'delete':
            deleteStudent($conn);
            break;
        case 'restore':
            restoreStudent($conn);
            break;
        case 'stats':
            getStats($conn);
            break;
        default:
            if ($method === 'GET') {
                getStudents($conn);
            } elseif ($method === 'POST') {
                addStudent($conn);
            } else {
                outputError('Invalid request');
            }
            break;
    }
} catch (Exception $e) {
    outputError(
        'Server error: ' . $e->getMessage(),
        'Please check the server logs for more details.'
    );
}

// Get all students
function getStudents($conn) {
    global $outputError;
    
    // Check database connection first
    if (isset($conn->connect_error) && $conn->connect_error) {
        outputError(
            'Database connection failed: ' . $conn->connect_error,
            'Please check your database configuration in config/db_connect.php'
        );
    }
    
    // Check if required tables exist
    $tablesCheck = @$conn->query("SHOW TABLES LIKE 'students'");
    if ($tablesCheck === false) {
        outputError(
            'Database error: ' . $conn->error,
            'Please check your database connection and ensure the database exists'
        );
    }
    
    if ($tablesCheck->num_rows === 0) {
        outputError(
            'Students table does not exist. Please run the database setup SQL file: database/setup_complete.sql',
            'Run the SQL file: database/setup_complete.sql in phpMyAdmin or use: mysql -u root -p osas_sys_db < database/setup_complete.sql'
        );
    }
    
    // Check if sections table exists (for JOIN) - non-critical, just check silently
    $sectionsCheck = @$conn->query("SHOW TABLES LIKE 'sections'");
    $sectionsExist = ($sectionsCheck !== false && $sectionsCheck->num_rows > 0);
    
    // Check if departments table exists (for JOIN) - non-critical, just check silently
    $deptCheck = @$conn->query("SHOW TABLES LIKE 'departments'");
    $deptExist = ($deptCheck !== false && $deptCheck->num_rows > 0);
    
    $filter = $_GET['filter'] ?? 'all';
    $search = $_GET['search'] ?? '';
    
    // Build query based on which tables exist
    if ($sectionsExist && $deptExist) {
        $query = "SELECT s.id, s.student_id, s.first_name, s.middle_name, s.last_name, 
                         s.email, s.contact_number, s.address, s.department, s.section_id, 
                         s.avatar, s.status, s.created_at, s.updated_at,
                         COALESCE(sec.section_name, 'N/A') as section_name, 
                         COALESCE(sec.section_code, 'N/A') as section_code, 
                         COALESCE(d.department_name, s.department) as department_name
                  FROM students s
                  LEFT JOIN sections sec ON s.section_id = sec.id
                  LEFT JOIN departments d ON s.department = d.department_code
                  WHERE 1=1";
    } elseif ($sectionsExist) {
        $query = "SELECT s.id, s.student_id, s.first_name, s.middle_name, s.last_name, 
                         s.email, s.contact_number, s.address, s.department, s.section_id, 
                         s.avatar, s.status, s.created_at, s.updated_at,
                         COALESCE(sec.section_name, 'N/A') as section_name, 
                         COALESCE(sec.section_code, 'N/A') as section_code, 
                         s.department as department_name
                  FROM students s
                  LEFT JOIN sections sec ON s.section_id = sec.id
                  WHERE 1=1";
    } else {
        $query = "SELECT s.id, s.student_id, s.first_name, s.middle_name, s.last_name, 
                         s.email, s.contact_number, s.address, s.department, s.section_id, 
                         s.avatar, s.status, s.created_at, s.updated_at,
                         'N/A' as section_name, 
                         'N/A' as section_code, 
                         s.department as department_name
                  FROM students s
                  WHERE 1=1";
    }
    
    $params = [];
    $types = "";
    
    if ($filter === 'active') {
        $query .= " AND s.status = 'active'";
    } elseif ($filter === 'inactive') {
        $query .= " AND s.status = 'inactive'";
    } elseif ($filter === 'graduating') {
        $query .= " AND s.status = 'graduating'";
    } elseif ($filter === 'archived') {
        $query .= " AND s.status = 'archived'";
    } else {
        // For 'all', exclude archived by default
        $query .= " AND s.status != 'archived'";
    }
    
    if (!empty($search)) {
        if ($sectionsExist && $deptExist) {
            $query .= " AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.middle_name LIKE ? OR s.student_id LIKE ? OR s.email LIKE ? OR s.department LIKE ? OR d.department_name LIKE ? OR sec.section_code LIKE ? OR sec.section_name LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $types .= "sssssssss";
        } elseif ($sectionsExist) {
            $query .= " AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.middle_name LIKE ? OR s.student_id LIKE ? OR s.email LIKE ? OR s.department LIKE ? OR sec.section_code LIKE ? OR sec.section_name LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $types .= "ssssssss";
        } else {
            $query .= " AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.middle_name LIKE ? OR s.student_id LIKE ? OR s.email LIKE ? OR s.department LIKE ?)";
            $searchTerm = "%$search%";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $types .= "ssssss";
        }
    }
    
    $query .= " ORDER BY s.created_at DESC";
    
    try {
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }
        
        if (!empty($params)) {
            if (!$stmt->bind_param($types, ...$params)) {
                throw new Exception('Bind param failed: ' . $stmt->error);
            }
        }
        
        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }
    } catch (Exception $e) {
        if (isset($stmt)) {
            $stmt->close();
        }
        outputError(
            'Database query error: ' . $e->getMessage(),
            'Please check if all required tables exist. Run the database setup SQL file: database/setup_complete.sql'
        );
    }
    
    try {
        $result = $stmt->get_result();
        
        // Debug: Check if we got any results
        $numRows = $result ? $result->num_rows : 0;
        
        $students = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                // Safely get values with defaults
                $firstName = $row['first_name'] ?? '';
                $middleName = $row['middle_name'] ?? '';
                $lastName = $row['last_name'] ?? '';
                $fullName = trim($firstName . ' ' . ($middleName ? $middleName . ' ' : '') . $lastName);
                
                // Generate avatar URL if not exists
                $avatar = $row['avatar'] ?? '';
                if (empty($avatar) || trim($avatar) === '') {
                    $avatar = 'https://ui-avatars.com/api/?name=' . urlencode($fullName) . '&background=ffd700&color=333&size=40';
                } else {
                    // If it's not a full URL (http/https) or data URL, it's a relative path
                    if (!filter_var($avatar, FILTER_VALIDATE_URL) && strpos($avatar, 'data:') !== 0) {
                        // Ensure it's in the correct format for storage (relative path)
                        // The JavaScript will convert it to display URL
                        // Just make sure it starts with 'assets/img/students/'
                        if (strpos($avatar, 'assets/img/students/') === false) {
                            if (strpos($avatar, '../assets/img/students/') === 0) {
                                // Remove the ../ prefix for storage
                                $avatar = substr($avatar, 3);
                            } else {
                                // Add the path prefix
                                $avatar = 'assets/img/students/' . basename($avatar);
                            }
                        }
                    }
                }
                
                $students[] = [
                    'id' => $row['id'] ?? 0,
                    'studentId' => $row['student_id'] ?? '',
                    'firstName' => $firstName,
                    'middleName' => $middleName,
                    'lastName' => $lastName,
                    'email' => $row['email'] ?? '',
                    'contact' => $row['contact_number'] ?: 'N/A',
                    'address' => $row['address'] ?: '',
                    'department' => $row['department_name'] ?? ($row['department'] ?? 'N/A'),
                    'section' => $row['section_code'] ?? 'N/A',
                    'section_id' => $row['section_id'] ?? null,
                    'status' => $row['status'] ?? 'active',
                    'avatar' => $avatar,
                    'date' => isset($row['created_at']) ? date('M d, Y', strtotime($row['created_at'])) : date('M d, Y')
                ];
            }
        }
    } catch (Exception $e) {
        $stmt->close();
        outputError(
            'Error processing results: ' . $e->getMessage(),
            'Please check the database structure and try again.'
        );
    }
    
    $stmt->close();
    
    // Return response
    $response = [
        'status' => 'success', 
        'data' => $students
    ];
    
    // Add debug info if no students found
    if (count($students) === 0) {
        $response['debug'] = [
            'query_rows' => $numRows,
            'filter' => $filter,
            'search' => $search,
            'message' => 'No students found. Make sure you have inserted student data using the SQL insert queries.'
        ];
    }
    
    // Ensure no output before JSON
    ob_clean();
    echo json_encode($response);
    ob_end_flush();
    exit;
}

// Add new student
function addStudent($conn) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        exit;
    }
    
    // Get studentId from studentIdCode (sent by form) or studentId (fallback)
    $studentId = htmlspecialchars(trim($_POST['studentIdCode'] ?? $_POST['studentId'] ?? ''));
    $firstName = htmlspecialchars(trim($_POST['firstName'] ?? ''));
    $middleName = htmlspecialchars(trim($_POST['middleName'] ?? ''));
    $lastName = htmlspecialchars(trim($_POST['lastName'] ?? ''));
    $email = htmlspecialchars(trim($_POST['studentEmail'] ?? ''));
    $contact = htmlspecialchars(trim($_POST['studentContact'] ?? ''));
    $address = htmlspecialchars(trim($_POST['studentAddress'] ?? ''));
    $department = htmlspecialchars(trim($_POST['studentDept'] ?? ''));
    $sectionId = intval($_POST['studentSection'] ?? 0);
    $status = htmlspecialchars(trim($_POST['studentStatus'] ?? 'active'));
    $avatar = htmlspecialchars(trim($_POST['studentAvatar'] ?? ''));
    
    // Validation
    if (empty($studentId) || empty($firstName) || empty($lastName) || empty($email)) {
        echo json_encode(['status' => 'error', 'message' => 'Student ID, First Name, Last Name, and Email are required.']);
        exit;
    }
    
    // Check if student ID already exists
    $check = $conn->prepare("SELECT id FROM students WHERE student_id = ?");
    if (!$check) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    $check->bind_param("s", $studentId);
    $check->execute();
    $result = $check->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Student ID already exists.']);
        $check->close();
        exit;
    }
    $check->close();
    
    // Check if email already exists
    $checkEmail = $conn->prepare("SELECT id FROM students WHERE email = ?");
    $checkEmail->bind_param("s", $email);
    $checkEmail->execute();
    $emailResult = $checkEmail->get_result();
    
    if ($emailResult->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email already exists.']);
        $checkEmail->close();
        exit;
    }
    $checkEmail->close();
    
    // Insert student
    $insert = $conn->prepare("
        INSERT INTO students (student_id, first_name, middle_name, last_name, email, contact_number, address, department, section_id, avatar, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    
    if (!$insert) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $insert->bind_param("ssssssssiss", $studentId, $firstName, $middleName, $lastName, $email, $contact, $address, $department, $sectionId, $avatar, $status);
    
    if ($insert->execute()) {
        echo json_encode([
            'status' => 'success', 
            'message' => 'Student added successfully!'
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add student: ' . $conn->error]);
    }
    
    $insert->close();
}

// Update student
function updateStudent($conn) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        exit;
    }
    
    $id = intval($_POST['studentId'] ?? $_GET['id'] ?? 0);
    // If studentId is not in POST, try to get it from the form data
    if ($id === 0 && isset($_POST['studentId'])) {
        $id = intval($_POST['studentId']);
    }
    $studentId = htmlspecialchars(trim($_POST['studentIdCode'] ?? ''));
    $firstName = htmlspecialchars(trim($_POST['firstName'] ?? ''));
    $middleName = htmlspecialchars(trim($_POST['middleName'] ?? ''));
    $lastName = htmlspecialchars(trim($_POST['lastName'] ?? ''));
    $email = htmlspecialchars(trim($_POST['studentEmail'] ?? ''));
    $contact = htmlspecialchars(trim($_POST['studentContact'] ?? ''));
    $address = htmlspecialchars(trim($_POST['studentAddress'] ?? ''));
    $department = htmlspecialchars(trim($_POST['studentDept'] ?? ''));
    $sectionId = intval($_POST['studentSection'] ?? 0);
    $status = htmlspecialchars(trim($_POST['studentStatus'] ?? 'active'));
    $avatar = htmlspecialchars(trim($_POST['studentAvatar'] ?? ''));
    
    if ($id === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid student ID']);
        exit;
    }
    
    // Validation
    if (empty($studentId) || empty($firstName) || empty($lastName) || empty($email)) {
        echo json_encode(['status' => 'error', 'message' => 'Student ID, First Name, Last Name, and Email are required.']);
        exit;
    }
    
    // Check if student ID already exists (excluding current student)
    $check = $conn->prepare("SELECT id FROM students WHERE student_id = ? AND id != ?");
    if (!$check) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    $check->bind_param("si", $studentId, $id);
    $check->execute();
    $result = $check->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Student ID already exists.']);
        $check->close();
        exit;
    }
    $check->close();
    
    // Check if email already exists (excluding current student)
    $checkEmail = $conn->prepare("SELECT id FROM students WHERE email = ? AND id != ?");
    $checkEmail->bind_param("si", $email, $id);
    $checkEmail->execute();
    $emailResult = $checkEmail->get_result();
    
    if ($emailResult->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email already exists.']);
        $checkEmail->close();
        exit;
    }
    $checkEmail->close();
    
    // Update student
    $update = $conn->prepare("
        UPDATE students 
        SET student_id = ?, first_name = ?, middle_name = ?, last_name = ?, email = ?, contact_number = ?, address = ?, department = ?, section_id = ?, avatar = ?, status = ?, updated_at = NOW()
        WHERE id = ?
    ");
    
    if (!$update) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $update->bind_param("ssssssssissi", $studentId, $firstName, $middleName, $lastName, $email, $contact, $address, $department, $sectionId, $avatar, $status, $id);
    
    if ($update->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Student updated successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update student: ' . $conn->error]);
    }
    
    $update->close();
}

// Delete student (now archives instead of hard delete)
function deleteStudent($conn) {
    $studentId = intval($_GET['id'] ?? $_POST['id'] ?? 0);
    
    if ($studentId === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid student ID']);
        exit;
    }
    
    // Archive student instead of hard delete
    $update = $conn->prepare("UPDATE students SET status = 'archived', updated_at = NOW() WHERE id = ?");
    if (!$update) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $update->bind_param("i", $studentId);
    
    if ($update->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Student archived successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to archive student: ' . $conn->error]);
    }
    
    $update->close();
}

// Restore student
function restoreStudent($conn) {
    $studentId = intval($_GET['id'] ?? $_POST['id'] ?? 0);
    
    if ($studentId === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid student ID']);
        exit;
    }
    
    $update = $conn->prepare("UPDATE students SET status = 'active', updated_at = NOW() WHERE id = ?");
    if (!$update) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $update->bind_param("i", $studentId);
    
    if ($update->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Student restored successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to restore student: ' . $conn->error]);
    }
    
    $update->close();
}

// Get statistics
function getStats($conn) {
    $total = $conn->query("SELECT COUNT(*) as count FROM students")->fetch_assoc()['count'];
    $active = $conn->query("SELECT COUNT(*) as count FROM students WHERE status = 'active'")->fetch_assoc()['count'];
    $inactive = $conn->query("SELECT COUNT(*) as count FROM students WHERE status = 'inactive'")->fetch_assoc()['count'];
    $graduating = $conn->query("SELECT COUNT(*) as count FROM students WHERE status = 'graduating'")->fetch_assoc()['count'];
    $archived = $conn->query("SELECT COUNT(*) as count FROM students WHERE status = 'archived'")->fetch_assoc()['count'];
    
    echo json_encode([
        'status' => 'success',
        'data' => [
            'total' => (int)$total,
            'active' => (int)$active,
            'inactive' => (int)$inactive,
            'graduating' => (int)$graduating,
            'archived' => (int)$archived
        ]
    ]);
}

$conn->close();
?>

