<?php
// test_api.php - Test API endpoints

echo "<h1>API Test Results</h1>";
echo "<style>body { font-family: Arial, sans-serif; margin: 20px; } .success { color: green; } .error { color: red; } .warning { color: orange; } pre { background: #f5f5f5; padding: 10px; border: 1px solid #ddd; }</style>";

// Test database connection
echo "<h2>1. Database Connection</h2>";
try {
    $host = "localhost";
    $user = "root";
    $pass = "";
    $dbname = "osas_sys_db";

    $conn = new mysqli($host, $user, $pass, $dbname);
    if ($conn->connect_error) {
        echo "<p class='error'>❌ Connection failed: " . $conn->connect_error . "</p>";
    } else {
        echo "<p class='success'>✅ Database connection successful</p>";
    }
} catch (Exception $e) {
    echo "<p class='error'>❌ Connection error: " . $e->getMessage() . "</p>";
    exit;
}

// Test tables existence
echo "<h2>2. Table Existence</h2>";
$tables = ['students', 'violations'];
foreach ($tables as $table) {
    $result = $conn->query("SHOW TABLES LIKE '$table'");
    if ($result->num_rows > 0) {
        $count = $conn->query("SELECT COUNT(*) as count FROM $table")->fetch_assoc()['count'];
        echo "<p class='success'>✅ $table table exists with $count records</p>";
    } else {
        echo "<p class='error'>❌ $table table does not exist</p>";
    }
}

// Test API endpoints
echo "<h2>3. API Endpoints</h2>";

// Test students API
echo "<h3>Students API:</h3>";
$context = stream_context_create([
    'http' => [
        'method' => 'GET',
        'header' => 'Content-Type: application/json',
        'timeout' => 10
    ]
]);

try {
    $students_url = "http://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/api/students.php";
    $students_response = file_get_contents($students_url, false, $context);

    if ($students_response === false) {
        echo "<p class='error'>❌ Students API not accessible</p>";
    } else {
        $students_data = json_decode($students_response, true);
        if ($students_data['status'] === 'success') {
            $count = count($students_data['data']);
            echo "<p class='success'>✅ Students API working - returned $count students</p>";
        } else {
            echo "<p class='error'>❌ Students API error: " . $students_data['message'] . "</p>";
        }
    }
} catch (Exception $e) {
    echo "<p class='error'>❌ Students API exception: " . $e->getMessage() . "</p>";
}

// Test violations API
echo "<h3>Violations API:</h3>";
try {
    $violations_url = "http://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/api/violations.php";
    $violations_response = file_get_contents($violations_url, false, $context);

    if ($violations_response === false) {
        echo "<p class='error'>❌ Violations API not accessible</p>";
    } else {
        $violations_data = json_decode($violations_response, true);
        if ($violations_data['status'] === 'success') {
            $count = count($violations_data['violations']);
            echo "<p class='success'>✅ Violations API working - returned $count violations</p>";
            if ($count > 0) {
                echo "<p><strong>Sample violation:</strong></p>";
                echo "<pre>" . json_encode($violations_data['violations'][0], JSON_PRETTY_PRINT) . "</pre>";
            }
        } else {
            echo "<p class='error'>❌ Violations API error: " . $violations_data['message'] . "</p>";
            echo "<pre>Full response: " . json_encode($violations_data, JSON_PRETTY_PRINT) . "</pre>";
        }
    }
} catch (Exception $e) {
    echo "<p class='error'>❌ Violations API exception: " . $e->getMessage() . "</p>";
}

$conn->close();

echo "<hr>";
echo "<h2>Troubleshooting Steps:</h2>";
echo "<ol>";
echo "<li>If APIs are not accessible, check file permissions on api/ folder</li>";
echo "<li>If tables don't exist, run the database setup scripts</li>";
echo "<li>Check browser developer tools (F12) for JavaScript errors</li>";
echo "<li>Try the debug functions: debugViolations(), debugStudents()</li>";
echo "</ol>";
?>
