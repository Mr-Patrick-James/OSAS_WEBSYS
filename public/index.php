<?php
/**
 * Main Entry Point - MVC Router
 * This file handles all routing for the application
 */

// Start output buffering
ob_start();

// Error reporting
error_reporting(E_ALL);
$isProduction = false;
ini_set('display_errors', $isProduction ? 0 : 1);
ini_set('log_errors', 1);

// Define base paths
define('BASE_PATH', dirname(__DIR__));
define('APP_PATH', BASE_PATH . '/app');
define('PUBLIC_PATH', __DIR__);

// Autoload classes
spl_autoload_register(function ($class) {
    $paths = [
        APP_PATH . '/core/' . $class . '.php',
        APP_PATH . '/models/' . $class . '.php',
        APP_PATH . '/controllers/' . $class . '.php'
    ];
    
    foreach ($paths as $path) {
        if (file_exists($path)) {
            require_once $path;
            return;
        }
    }
});

// Load router
require_once APP_PATH . '/core/Router.php';

// Create router instance
$router = new Router();

// API Routes
// Students
$router->get('/api/students.php', [StudentController::class, 'index']);
$router->get('/api/students.php?action=get', [StudentController::class, 'index']);
$router->get('/api/students.php?action=stats', [StudentController::class, 'stats']);
$router->post('/api/students.php?action=add', [StudentController::class, 'create']);
$router->post('/api/students.php?action=update', [StudentController::class, 'update']);
$router->get('/api/students.php?action=delete', [StudentController::class, 'delete']);
$router->get('/api/students.php?action=restore', [StudentController::class, 'restore']);

// Departments
$router->get('/api/departments.php', [DepartmentController::class, 'dropdown']);
$router->get('/api/departments.php?action=get', [DepartmentController::class, 'index']);
$router->get('/api/departments.php?action=stats', [DepartmentController::class, 'stats']);
$router->post('/api/departments.php?action=add', [DepartmentController::class, 'create']);
$router->post('/api/departments.php?action=update', [DepartmentController::class, 'update']);
$router->get('/api/departments.php?action=delete', [DepartmentController::class, 'delete']);

// Sections
$router->get('/api/sections.php', [SectionController::class, 'index']);
$router->get('/api/sections.php?action=getByDepartment', [SectionController::class, 'getByDepartment']);
$router->post('/api/sections.php?action=add', [SectionController::class, 'create']);
$router->post('/api/sections.php?action=update', [SectionController::class, 'update']);
$router->get('/api/sections.php?action=delete', [SectionController::class, 'delete']);

// Violations
$router->get('/api/violations.php', [ViolationController::class, 'index']);
$router->post('/api/violations.php', [ViolationController::class, 'create']);
$router->put('/api/violations.php', [ViolationController::class, 'update']);
$router->delete('/api/violations.php', [ViolationController::class, 'delete']);

// Auth
$router->post('/auth/login.php', [AuthController::class, 'login']);
$router->get('/auth/logout.php', [AuthController::class, 'logout']);
$router->get('/auth/check_session.php', [AuthController::class, 'check']);

// Handle legacy API routes (for backward compatibility)
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$query = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);

// If it's an API route, dispatch it
if (strpos($path, '/api/') === 0 || strpos($path, '/auth/') === 0) {
    $router->dispatch();
    exit;
}

// For non-API routes, serve the original files
// This maintains backward compatibility with existing pages
$requestedFile = BASE_PATH . $path;

// If it's a directory, try index.php
if (is_dir($requestedFile)) {
    $requestedFile .= '/index.php';
}

// If file exists and is not in app/ or public/, serve it
if (file_exists($requestedFile) && 
    strpos($requestedFile, APP_PATH) === false && 
    strpos($requestedFile, PUBLIC_PATH) === false) {
    
    // For PHP files, include them
    if (pathinfo($requestedFile, PATHINFO_EXTENSION) === 'php') {
        require_once $requestedFile;
    } else {
        // For other files (CSS, JS, images), let the web server handle them
        return false;
    }
} else {
    // 404 - File not found
    http_response_code(404);
    echo "404 - Page not found";
}

