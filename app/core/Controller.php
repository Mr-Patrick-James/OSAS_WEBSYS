<?php
/**
 * Base Controller Class
 */
class Controller {
    
    /**
     * Load a view
     */
    protected function view($viewName, $data = []) {
        extract($data);
        $viewFile = __DIR__ . '/../views/' . $viewName . '.php';
        
        if (!file_exists($viewFile)) {
            die("View not found: $viewName");
        }
        
        require_once $viewFile;
    }

    /**
     * Return JSON response
     */
    protected function json($data, $statusCode = 200) {
        // Clear all output buffers
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        
        // Set headers
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        
        // Encode and output JSON
        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        
        // Check for JSON encoding errors
        if ($json === false) {
            $error = json_last_error_msg();
            error_log("JSON encoding error: " . $error);
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'Failed to encode response: ' . $error
            ]);
        } else {
            echo $json;
        }
        
        exit;
    }

    /**
     * Return JSON success response
     */
    protected function success($message, $data = [], $statusCode = 200) {
        $this->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ], $statusCode);
    }

    /**
     * Return JSON error response
     */
    protected function error($message, $help = '', $statusCode = 400) {
        $this->json([
            'status' => 'error',
            'message' => $message,
            'data' => [],
            'help' => $help
        ], $statusCode);
    }

    /**
     * Check if user is logged in
     */
    protected function requireAuth() {
        session_start();
        if (!isset($_SESSION['user_id'])) {
            $this->error('Authentication required', 'Please login first', 401);
        }
    }

    /**
     * Check if user has admin role
     */
    protected function requireAdmin() {
        $this->requireAuth();
        if ($_SESSION['role'] !== 'admin') {
            $this->error('Access denied', 'Admin privileges required', 403);
        }
    }

    /**
     * Get POST data
     */
    protected function getPost($key = null, $default = null) {
        if ($key === null) {
            return $_POST;
        }
        return $_POST[$key] ?? $default;
    }

    /**
     * Get GET data
     */
    protected function getGet($key = null, $default = null) {
        if ($key === null) {
            return $_GET;
        }
        return $_GET[$key] ?? $default;
    }

    /**
     * Sanitize input
     */
    protected function sanitize($input) {
        return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }
}

