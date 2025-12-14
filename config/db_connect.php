<?php
// Database configuration
// LOCAL WAMP SETTINGS (for development)
$host = "localhost";  // or "127.0.0.1"
$user = "root";       // default WAMP MySQL user
$pass = "";           // default WAMP MySQL password (usually empty)
$dbname = "osas";     // your local database name

// REMOTE HOSTING SETTINGS (uncomment when deploying online)
// $host = "sql203.ezyro.com";
// $user = "ezyro_40680047";
// $pass = "294811dc39a770";
// $dbname = "ezyro_40680047_osas";

// Create connection
$conn = @new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
    // Log error but don't die - let the calling code handle it
    error_log("Database connection failed: " . $conn->connect_error);
    // Keep $conn as the mysqli object (even with error) so Model can check connect_error
    // Don't set to null - let Model handle the error
} else {
    // Set charset to UTF-8 for proper character encoding
    if (!$conn->set_charset("utf8mb4")) {
        error_log("Warning: Failed to set charset to utf8mb4: " . $conn->error);
    }
}
?>
