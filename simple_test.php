<?php
// Simple test to check PHP and database connectivity

echo "<h1>PHP and Database Test</h1>";

// Test PHP
echo "<h2>1. PHP Status</h2>";
echo "<p class='success'>✅ PHP is working - Version: " . phpversion() . "</p>";

// Test database connection
echo "<h2>2. Database Connection</h2>";
try {
    $host = "localhost";
    $user = "root";
    $pass = "";
    $dbname = "osas_sys_db";

    $conn = new mysqli($host, $user, $pass, $dbname);

    if ($conn->connect_error) {
        echo "<p class='error'>❌ Database connection failed: " . $conn->connect_error . "</p>";
    } else {
        echo "<p class='success'>✅ Database connection successful</p>";

        // Test query
        echo "<h2>3. Database Query Test</h2>";
        $result = $conn->query("SHOW TABLES");
        if ($result) {
            $tables = [];
            while ($row = $result->fetch_array()) {
                $tables[] = $row[0];
            }
            echo "<p class='success'>✅ Query successful - Found " . count($tables) . " tables: " . implode(', ', $tables) . "</p>";
        } else {
            echo "<p class='error'>❌ Query failed: " . $conn->error . "</p>";
        }

        $conn->close();
    }
} catch (Exception $e) {
    echo "<p class='error'>❌ Database error: " . $e->getMessage() . "</p>";
}

// Test file access
echo "<h2>4. File Access Test</h2>";
$apiFile = __DIR__ . '/api/violations.php';
if (file_exists($apiFile)) {
    echo "<p class='success'>✅ API file exists: $apiFile</p>";
    if (is_readable($apiFile)) {
        echo "<p class='success'>✅ API file is readable</p>";
    } else {
        echo "<p class='error'>❌ API file is not readable</p>";
    }
} else {
    echo "<p class='error'>❌ API file does not exist: $apiFile</p>";
}

echo "<hr>";
echo "<p><a href='debug_violations.html'>← Back to Debug Page</a></p>";

echo "<style>
body { font-family: Arial, sans-serif; margin: 20px; }
.success { color: green; }
.error { color: red; }
.warning { color: orange; }
</style>";
?>
