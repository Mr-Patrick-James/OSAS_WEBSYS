<?php
// auth/register.php
require_once '../config/db_connect.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Sanitize input
    $student_id = htmlspecialchars(trim($_POST['student_id'] ?? ''));
    $first_name = htmlspecialchars(trim($_POST['first_name'] ?? ''));
    $last_name  = htmlspecialchars(trim($_POST['last_name'] ?? ''));
    $department = htmlspecialchars(trim($_POST['department'] ?? ''));
    $email      = htmlspecialchars(trim($_POST['email'] ?? ''));
    $username   = htmlspecialchars(trim($_POST['username'] ?? ''));
    $password   = $_POST['password'] ?? '';
    $role       = htmlspecialchars(trim($_POST['role'] ?? 'user')); // default role

    // Basic validation
    if (empty($first_name) || empty($last_name) || empty($email) || empty($username) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'All required fields must be filled out.']);
        exit;
    }

    // Check for existing username/email
    $check = $conn->prepare("SELECT * FROM users WHERE email = ? OR username = ?");
    if (!$check) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    $check->bind_param("ss", $email, $username);
    $check->execute();
    $result = $check->get_result();

    if ($result && $result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email or username already exists.']);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert user
    $insert = $conn->prepare("
        INSERT INTO users (student_id, first_name, last_name, department, email, username, password, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    if (!$insert) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }

    $insert->bind_param(
        "ssssssss",
        $student_id,
        $first_name,
        $last_name,
        $department,
        $email,
        $username,
        $hashedPassword,
        $role
    );

    if ($insert->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Account created successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to register user.']);
    }

    $check->close();
    $insert->close();
    $conn->close();
}
?>
