<?php
// Test script to check students API
require_once 'config/db_connect.php';

header('Content-Type: application/json');

// Check if table exists
$tablesCheck = $conn->query("SHOW TABLES LIKE 'students'");
if ($tablesCheck->num_rows === 0) {
    echo json_encode(['error' => 'Students table does not exist']);
    exit;
}

// Count total students
$countQuery = $conn->query("SELECT COUNT(*) as total FROM students");
$countRow = $countQuery->fetch_assoc();
$total = $countRow['total'];

// Get sample data
$sampleQuery = $conn->query("SELECT * FROM students LIMIT 5");
$samples = [];
while ($row = $sampleQuery->fetch_assoc()) {
    $samples[] = $row;
}

echo json_encode([
    'table_exists' => true,
    'total_students' => $total,
    'sample_data' => $samples,
    'columns' => $samples ? array_keys($samples[0]) : []
], JSON_PRETTY_PRINT);

