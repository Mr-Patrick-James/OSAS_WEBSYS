<?php
// Test file to verify departments API works
// Access this file directly in browser: http://localhost/OSAS_WEBSYS/test_departments_api.php

require_once 'config/db_connect.php';

echo "<h2>Testing Departments API</h2>";

// Test 1: Check database connection
echo "<h3>1. Database Connection:</h3>";
if ($conn->connect_error) {
    echo "❌ Connection failed: " . $conn->connect_error;
} else {
    echo "✅ Connected successfully<br>";
}

// Test 2: Check if departments table exists
echo "<h3>2. Departments Table:</h3>";
$tableCheck = $conn->query("SHOW TABLES LIKE 'departments'");
if ($tableCheck->num_rows === 0) {
    echo "❌ Departments table does not exist!<br>";
    echo "Please run: database/setup_all.sql<br>";
} else {
    echo "✅ Departments table exists<br>";
}

// Test 3: Count departments
echo "<h3>3. Department Count:</h3>";
$countResult = $conn->query("SELECT COUNT(*) as count FROM departments");
if ($countResult) {
    $count = $countResult->fetch_assoc()['count'];
    echo "Total departments: " . $count . "<br>";
} else {
    echo "❌ Error: " . $conn->error . "<br>";
}

// Test 4: Get all departments
echo "<h3>4. All Departments:</h3>";
$result = $conn->query("SELECT * FROM departments ORDER BY created_at DESC");
if ($result && $result->num_rows > 0) {
    echo "<table border='1' cellpadding='5'>";
    echo "<tr><th>ID</th><th>Name</th><th>Code</th><th>Status</th><th>Created</th></tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row['id'] . "</td>";
        echo "<td>" . $row['department_name'] . "</td>";
        echo "<td>" . $row['department_code'] . "</td>";
        echo "<td>" . $row['status'] . "</td>";
        echo "<td>" . $row['created_at'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "No departments found in database.<br>";
}

// Test 5: Test API endpoint
echo "<h3>5. Test API Endpoint:</h3>";
echo "<a href='api/departments.php?action=get' target='_blank'>Click here to test API</a><br>";
echo "Or copy this URL: <code>api/departments.php?action=get</code>";

$conn->close();
?>

