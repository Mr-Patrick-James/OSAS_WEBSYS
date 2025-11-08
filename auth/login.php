<?php
session_start();
include("../config/db_connect.php");

// Set JSON response header
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);
    $remember = isset($_POST['rememberMe']) && $_POST['rememberMe'] === 'true';

    if (empty($username) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Please fill in all fields.']);
        exit();
    }

    // Query user
    $query = "SELECT * FROM users WHERE username = ? OR email = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ss", $username, $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user["password"])) {
            // Admin: use PHP session
            if ($user["role"] === "admin") {
                $_SESSION["user_id"] = $user["id"];
                $_SESSION["username"] = $user["username"];
                $_SESSION["role"] = $user["role"];

                echo json_encode([
                    'status' => 'success',
                    'role' => 'admin',
                    'name' => $user["username"],
                    'studentId' => $user["id"],
                    'expires' => time() + ($remember ? 30*24*60*60 : 6*60*60) // seconds
                ]);
                exit();
            }

            // User: store in localStorage via AJAX
            echo json_encode([
                'status' => 'success',
                'role' => 'user',
                'name' => $user["username"],
                'studentId' => $user["id"],
                'expires' => time() + ($remember ? 30*24*60*60 : 6*60*60) // seconds
            ]);
            exit();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid password.']);
            exit();
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User not found.']);
        exit();
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit();
}
