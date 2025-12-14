<?php
// auth/verify_session.php
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: same-origin');
header('Access-Control-Allow-Credentials: true');

// Check if user is logged in with proper session validation
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true && 
    isset($_SESSION['user_id']) && isset($_SESSION['role'])) {
    
    echo json_encode([
        'logged_in' => true,
        'role' => $_SESSION['role'],
        'username' => $_SESSION['username'],
        'studentId' => $_SESSION['studentId'] ?? $_SESSION['user_id']
    ]);
} else {
    // Clear any partial session data
    unset($_SESSION['logged_in']);
    unset($_SESSION['user_id']);
    unset($_SESSION['role']);
    unset($_SESSION['username']);
    unset($_SESSION['studentId']);
    
    echo json_encode([
        'logged_in' => false
    ]);
}
?>