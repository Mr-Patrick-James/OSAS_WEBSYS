<?php
session_start();
include("../config/db_connect.php");

// JSON response
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);
    $remember = isset($_POST['rememberMe']) && $_POST['rememberMe'] === 'true';

    if (empty($username) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Please fill in all fields.']);
        exit();
    }

    // Query user by username or email
    $query = "SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ss", $username, $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user["password"])) {

            // ✅ Always create PHP session
            $_SESSION["user_id"] = $user["id"];
            $_SESSION["username"] = $user["username"];
            $_SESSION["role"] = $user["role"];

            // Set expiry (6 hours default, 30 days if remember me)
            $expiryTime = time() + ($remember ? 30*24*60*60 : 6*60*60);

            // ✅ Set cookies only if remember is checked
            if ($remember) {
                setcookie("user_id", $user["id"], $expiryTime, "/");
                setcookie("username", $user["username"], $expiryTime, "/");
                setcookie("role", $user["role"], $expiryTime, "/");
            } else {
                // Clear cookies if previously set
                setcookie("user_id", "", time() - 3600, "/");
                setcookie("username", "", time() - 3600, "/");
                setcookie("role", "", time() - 3600, "/");
            }

            echo json_encode([
                'status' => 'success',
                'role' => $user["role"],
                'name' => $user["username"],
                'studentId' => $user["id"],
                'expires' => $expiryTime
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
?>