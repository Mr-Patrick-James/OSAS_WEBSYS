<?php
// Database configuration
// Update these values for your online hosting environment
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "osas"; // <-- your database name

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection (error handling is done in API files)
// Don't die here - let the API files handle errors properly
if ($conn->connect_error) {
    // Connection failed - API files will handle this
    // This allows API files to return proper JSON error responses
}

// Set charset to UTF-8 for proper character encoding
if (!$conn->connect_error) {
    $conn->set_charset("utf8mb4");
}
?>
