<?php
/**
 * API Wrapper - Maintains backward compatibility
 * Routes to MVC Controller
 */

// Error reporting
error_reporting(E_ALL);
$isProduction = false;
ini_set('display_errors', $isProduction ? 0 : 1);
ini_set('log_errors', 1);

// Start output buffering to catch any errors/warnings
while (ob_get_level() > 0) {
    ob_end_clean();
}
ob_start();

require_once __DIR__ . '/../app/core/Model.php';
require_once __DIR__ . '/../app/core/Controller.php';
require_once __DIR__ . '/../app/models/ViolationModel.php';
require_once __DIR__ . '/../app/models/StudentModel.php';
require_once __DIR__ . '/../app/controllers/ViolationController.php';

$controller = new ViolationController();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

switch ($method) {
    case 'GET':
        if ($id > 0) {
            // Get single violation - would need to implement this
            $controller->index();
        } else {
            $controller->index();
        }
        break;
    case 'POST':
        $controller->create();
        break;
    case 'PUT':
        if ($id > 0) {
            $controller->update();
        } else {
            $controller->error('Violation ID required for update');
        }
        break;
    case 'DELETE':
        if ($id > 0) {
            $controller->delete();
        } else {
            $controller->error('Violation ID required for deletion');
        }
        break;
    default:
        $controller->error('Invalid request method');
        break;
}
