<?php
// setup_violations.php - Quick setup script for violations system

echo "<h1>OSAS Violations System Setup</h1>";
echo "<p>This script will help you set up the violations system.</p>";

// Database connection
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "osas_sys_db";

try {
    $conn = new mysqli($host, $user, $pass, $dbname);

    if ($conn->connect_error) {
        die("<p style='color: red;'>❌ Database connection failed: " . $conn->connect_error . "</p>");
    }

    echo "<p style='color: green;'>✅ Database connection successful</p>";

    // Check if violations table exists
    $result = $conn->query("SHOW TABLES LIKE 'violations'");

    if ($result->num_rows > 0) {
        echo "<p style='color: blue;'>ℹ️ Violations table already exists</p>";

        // Check if it has data
        $countResult = $conn->query("SELECT COUNT(*) as count FROM violations");
        $count = $countResult->fetch_assoc()['count'];
        echo "<p style='color: blue;'>ℹ️ Violations table contains {$count} records</p>";

    } else {
        echo "<p style='color: orange;'>⚠️ Violations table does not exist. Creating...</p>";

        // Create violations table
        $sql = "
        CREATE TABLE IF NOT EXISTS violations (
            id INT PRIMARY KEY AUTO_INCREMENT,
            case_id VARCHAR(20) NOT NULL UNIQUE,
            student_id VARCHAR(20) NOT NULL,
            violation_type ENUM('improper_uniform', 'no_id', 'improper_footwear', 'misconduct') NOT NULL,
            violation_level ENUM('permitted1', 'permitted2', 'warning1', 'warning2', 'warning3', 'disciplinary') NOT NULL,
            department ENUM('BSIS', 'WFT', 'BTVTED', 'CHS') NOT NULL,
            section VARCHAR(20) NOT NULL,
            violation_date DATE NOT NULL,
            violation_time TIME NOT NULL,
            location ENUM('gate_1', 'gate_2', 'classroom', 'library', 'cafeteria', 'gym', 'others') NOT NULL,
            reported_by VARCHAR(100) NOT NULL,
            notes TEXT,
            status ENUM('permitted', 'warning', 'disciplinary', 'resolved') NOT NULL DEFAULT 'warning',
            attachments JSON NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

            INDEX idx_case_id (case_id),
            INDEX idx_student_id (student_id),
            INDEX idx_department (department),
            INDEX idx_status (status),
            INDEX idx_violation_date (violation_date),
            INDEX idx_violation_type (violation_type),
            INDEX idx_violation_level (violation_level),

            FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
        )";

        if ($conn->query($sql) === TRUE) {
            echo "<p style='color: green;'>✅ Violations table created successfully</p>";

            // Insert sample data
            echo "<p style='color: blue;'>ℹ️ Adding sample data...</p>";

            $sampleData = [
                ['VIOL-2024-001', '2024-001', 'improper_uniform', 'warning2', 'BSIT', 'BSIT-3A', '2024-02-15', '08:15:00', 'gate_1', 'Officer Maria Santos', 'warning', 'Student was found wearing improper uniform - wearing colored undershirt instead of the required white undershirt. This is the second offense for improper uniform violation.'],
                ['VIOL-2024-002', '2024-002', 'no_id', 'permitted1', 'BSIT', 'BSIT-1B', '2024-02-14', '07:30:00', 'gate_2', 'Officer Juan Dela Cruz', 'permitted', 'Student forgot to bring ID. First offense.'],
                ['VIOL-2024-003', '2024-003', 'improper_footwear', 'disciplinary', 'BSIT', 'BSIT-2A', '2024-02-10', '08:30:00', 'classroom', 'Professor Ana Reyes', 'disciplinary', 'Student was wearing sneakers instead of the required black leather shoes in violation of school uniform policy.']
            ];

            $inserted = 0;
            foreach ($sampleData as $data) {
                $stmt = $conn->prepare("INSERT INTO violations (case_id, student_id, violation_type, violation_level, department, section, violation_date, violation_time, location, reported_by, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("ssssssssssss", ...$data);
                if ($stmt->execute()) {
                    $inserted++;
                }
                $stmt->close();
            }

            echo "<p style='color: green;'>✅ Added {$inserted} sample violations</p>";

        } else {
            echo "<p style='color: red;'>❌ Error creating table: " . $conn->error . "</p>";
        }
    }

    // Check students table
    $studentResult = $conn->query("SHOW TABLES LIKE 'students'");
    if ($studentResult->num_rows > 0) {
        $studentCount = $conn->query("SELECT COUNT(*) as count FROM students")->fetch_assoc()['count'];
        echo "<p style='color: green;'>✅ Students table exists with {$studentCount} records</p>";
    } else {
        echo "<p style='color: red;'>❌ Students table does not exist. Please run the main database setup first.</p>";
    }

    $conn->close();

} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Error: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<h2>Next Steps:</h2>";
echo "<ol>";
echo "<li><a href='pages/admin_page/Violations.php'>Go to Violations Page</a></li>";
echo "<li>Open browser Developer Tools (F12) and check Console for any errors</li>";
echo "<li>If data doesn't load, click the 'Check Setup' button on the page</li>";
echo "</ol>";

echo "<p><strong>Debug Commands</strong> (run in browser console):</p>";
echo "<ul>";
echo "<li><code>debugViolations()</code> - Show violations data</li>";
echo "<li><code>debugStudents()</code> - Show students data</li>";
echo "<li><code>forceReloadData()</code> - Force reload all data</li>";
echo "</ul>";
?>
