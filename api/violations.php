<?php
// api/violations.php - API endpoint for Violations CRUD operations

// Start output buffering
ob_start();

// Enable error display for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set JSON response header FIRST
header('Content-Type: application/json');

// Start session
@session_start();

// Function to output JSON error and exit
function outputError($message, $help = '') {
    ob_clean();
    echo json_encode([
        'status' => 'error',
        'message' => $message,
        'data' => [],
        'help' => $help
    ]);
    exit;
}

// Connect to database with error handling
try {
    $host = "localhost";
    $user = "root";
    $pass = "";
    $dbname = "osas_sys_db";

    $conn = @new mysqli($host, $user, $pass, $dbname);

    // Check connection
    if ($conn->connect_error) {
        outputError(
            'Database connection failed: ' . $conn->connect_error,
            'Please check your database configuration. Make sure the database "osas_sys_db" exists and credentials are correct.'
        );
    }
    
    // Set charset to UTF-8
    $conn->set_charset("utf8mb4");
    
} catch (Exception $e) {
    outputError(
        'Database connection error: ' . $e->getMessage(),
        'Please check your database configuration'
    );
}

// Clear any output that might have been generated
ob_clean();

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Handle different HTTP methods
try {
    switch ($method) {
        case 'GET':
            if ($id > 0) {
                getViolation($conn, $id);
            } else {
                getViolations($conn);
            }
            break;
        case 'POST':
            addViolation($conn);
            break;
        case 'PUT':
            if ($id > 0) {
                updateViolation($conn, $id);
            } else {
                outputError('Violation ID required for update');
            }
            break;
        case 'DELETE':
            if ($id > 0) {
                deleteViolation($conn, $id);
            } else {
                outputError('Violation ID required for deletion');
            }
            break;
        default:
            outputError('Invalid request method');
            break;
    }
} catch (Exception $e) {
    outputError(
        'Server error: ' . $e->getMessage(),
        'Please check the server logs for more details.'
    );
}

// Get all violations
function getViolations($conn) {
    // Check if violations table exists
    $tablesCheck = @$conn->query("SHOW TABLES LIKE 'violations'");
    if ($tablesCheck === false) {
        outputError(
            'Database error: ' . $conn->error,
            'Please check your database connection and ensure the database exists'
        );
    }

    if ($tablesCheck->num_rows === 0) {
        outputError(
            'Violations table does not exist.',
            'Run the SQL file: database/violations_table.sql in phpMyAdmin'
        );
    }

    $filter = $_GET['filter'] ?? 'all';
    $search = $_GET['search'] ?? '';

    // Base query to get violations with student info
    // Using COLLATE to fix collation mismatch between tables
    $query = "SELECT 
                v.*, 
                s.student_id as student_id_no,
                s.first_name, 
                s.middle_name, 
                s.last_name, 
                s.email, 
                s.contact_number, 
                s.avatar,
                s.department as student_dept,
                s.section_id as student_section
              FROM violations v
              LEFT JOIN students s ON v.student_id COLLATE utf8mb4_unicode_ci = s.student_id COLLATE utf8mb4_unicode_ci
              WHERE 1=1";

    $params = [];
    $types = "";

    // Add filters
    if ($filter === 'resolved') {
        $query .= " AND v.status = 'resolved'";
    } elseif ($filter === 'pending') {
        $query .= " AND v.status IN ('warning', 'permitted')";
    } elseif ($filter === 'disciplinary') {
        $query .= " AND v.status = 'disciplinary'";
    }

    // Add search functionality
    if (!empty($search)) {
        $query .= " AND (v.case_id LIKE ? OR s.first_name LIKE ? OR s.last_name LIKE ? OR v.student_id LIKE ? OR v.violation_type LIKE ?)";
        $searchTerm = "%$search%";
        $params = array_fill(0, 5, $searchTerm);
        $types = "sssss";
    }

    $query .= " ORDER BY v.created_at DESC";

    try {
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }

        if (!empty($params)) {
            if (!$stmt->bind_param($types, ...$params)) {
                throw new Exception('Bind param failed: ' . $stmt->error);
            }
        }

        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }

        $result = $stmt->get_result();
        $violations = [];

        while ($row = $result->fetch_assoc()) {
            // Build full name
            $firstName = $row['first_name'] ?? '';
            $middleName = $row['middle_name'] ?? '';
            $lastName = $row['last_name'] ?? '';
            $fullName = trim($firstName . ' ' . ($middleName ? $middleName . ' ' : '') . $lastName);

            // Generate avatar if not exists
            $avatar = $row['avatar'] ?? '';
            if (empty($avatar)) {
                $avatar = 'https://ui-avatars.com/api/?name=' . urlencode($fullName) . '&background=ffd700&color=333&size=80';
            }

            // Format violation type label
            $violationTypeLabels = [
                'improper_uniform' => 'Improper Uniform',
                'no_id' => 'No ID',
                'improper_footwear' => 'Improper Footwear',
                'misconduct' => 'Misconduct'
            ];
            $violationTypeLabel = $violationTypeLabels[$row['violation_type']] ?? ucfirst(str_replace('_', ' ', $row['violation_type']));

            // Format violation level label
            $violationLevelLabels = [
                'permitted1' => 'Permitted 1',
                'permitted2' => 'Permitted 2',
                'warning1' => 'Warning 1',
                'warning2' => 'Warning 2',
                'warning3' => 'Warning 3',
                'disciplinary' => 'Disciplinary'
            ];
            $violationLevelLabel = $violationLevelLabels[$row['violation_level']] ?? ucfirst($row['violation_level']);

            // Format status label
            $statusLabels = [
                'permitted' => 'Permitted',
                'warning' => 'Warning',
                'disciplinary' => 'Disciplinary',
                'resolved' => 'Resolved'
            ];
            $statusLabel = $statusLabels[$row['status']] ?? ucfirst($row['status']);

            // Format location label
            $locationLabels = [
                'gate_1' => 'Main Gate 1',
                'gate_2' => 'Gate 2',
                'classroom' => 'Classroom',
                'library' => 'Library',
                'cafeteria' => 'Cafeteria',
                'gym' => 'Gymnasium',
                'others' => 'Others'
            ];
            $locationLabel = $locationLabels[$row['location']] ?? ucfirst(str_replace('_', ' ', $row['location']));

            // Format date and time
            $violationDateTime = '';
            if ($row['violation_date'] && $row['violation_time']) {
                $dateTime = new DateTime($row['violation_date'] . ' ' . $row['violation_time']);
                $violationDateTime = $dateTime->format('M d, Y • h:i A');
            }

            $violations[] = [
                'id' => (int)$row['id'],
                'caseId' => $row['case_id'] ?? '',
                'studentId' => $row['student_id'] ?? '',
                'studentName' => $fullName,
                'studentImage' => $avatar,
                'studentDept' => $row['student_dept'] ?? $row['department'] ?? '',
                'studentSection' => $row['student_section'] ?? $row['section'] ?? '',
                'studentContact' => $row['contact_number'] ?? 'N/A',
                'violationType' => $row['violation_type'] ?? '',
                'violationTypeLabel' => $violationTypeLabel,
                'violationLevel' => $row['violation_level'] ?? '',
                'violationLevelLabel' => $violationLevelLabel,
                'department' => $row['department'] ?? '',
                'section' => $row['section'] ?? '',
                'dateReported' => $row['violation_date'] ?? '',
                'violationTime' => $row['violation_time'] ?? '',
                'dateTime' => $violationDateTime,
                'location' => $row['location'] ?? '',
                'locationLabel' => $locationLabel,
                'reportedBy' => $row['reported_by'] ?? '',
                'status' => $row['status'] ?? 'warning',
                'statusLabel' => $statusLabel,
                'notes' => $row['notes'] ?? '',
                'attachments' => !empty($row['attachments']) ? json_decode($row['attachments'], true) : [],
                'created_at' => $row['created_at'] ?? '',
                'updated_at' => $row['updated_at'] ?? ''
            ];
        }

        $stmt->close();

        // Return response in the format expected by the JavaScript
        $response = [
            'status' => 'success',
            'message' => 'Violations retrieved successfully',
            'violations' => $violations,
            'count' => count($violations)
        ];

        ob_clean();
        echo json_encode($response);
        exit;

    } catch (Exception $e) {
        if (isset($stmt)) {
            $stmt->close();
        }
        outputError(
            'Database query error: ' . $e->getMessage(),
            'Please check if the violations table exists and has the correct structure.'
        );
    }
}

// Get single violation
function getViolation($conn, $id) {
    // Using COLLATE to fix collation mismatch between tables
    $query = "SELECT 
                v.*, 
                s.first_name, 
                s.middle_name, 
                s.last_name, 
                s.email, 
                s.contact_number, 
                s.avatar,
                s.department as student_dept,
                s.section_id as student_section
              FROM violations v
              LEFT JOIN students s ON v.student_id COLLATE utf8mb4_unicode_ci = s.student_id COLLATE utf8mb4_unicode_ci
              WHERE v.id = ?";

    try {
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }

        $stmt->bind_param("i", $id);

        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }

        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            outputError('Violation not found');
        }

        $row = $result->fetch_assoc();
        $stmt->close();

        // Format the violation data (similar to getViolations)
        $firstName = $row['first_name'] ?? '';
        $middleName = $row['middle_name'] ?? '';
        $lastName = $row['last_name'] ?? '';
        $fullName = trim($firstName . ' ' . ($middleName ? $middleName . ' ' : '') . $lastName);

        $avatar = $row['avatar'] ?? '';
        if (empty($avatar)) {
            $avatar = 'https://ui-avatars.com/api/?name=' . urlencode($fullName) . '&background=ffd700&color=333&size=80';
        }

        $violationTypeLabels = [
            'improper_uniform' => 'Improper Uniform',
            'no_id' => 'No ID',
            'improper_footwear' => 'Improper Footwear',
            'misconduct' => 'Misconduct'
        ];
        $violationTypeLabel = $violationTypeLabels[$row['violation_type']] ?? ucfirst(str_replace('_', ' ', $row['violation_type']));

        $violationLevelLabels = [
            'permitted1' => 'Permitted 1',
            'permitted2' => 'Permitted 2',
            'warning1' => 'Warning 1',
            'warning2' => 'Warning 2',
            'warning3' => 'Warning 3',
            'disciplinary' => 'Disciplinary'
        ];
        $violationLevelLabel = $violationLevelLabels[$row['violation_level']] ?? ucfirst($row['violation_level']);

        $statusLabels = [
            'permitted' => 'Permitted',
            'warning' => 'Warning',
            'disciplinary' => 'Disciplinary',
            'resolved' => 'Resolved'
        ];
        $statusLabel = $statusLabels[$row['status']] ?? ucfirst($row['status']);

        $locationLabels = [
            'gate_1' => 'Main Gate 1',
            'gate_2' => 'Gate 2',
            'classroom' => 'Classroom',
            'library' => 'Library',
            'cafeteria' => 'Cafeteria',
            'gym' => 'Gymnasium',
            'others' => 'Others'
        ];
        $locationLabel = $locationLabels[$row['location']] ?? ucfirst(str_replace('_', ' ', $row['location']));

        // Format date and time
        $violationDateTime = '';
        if ($row['violation_date'] && $row['violation_time']) {
            $dateTime = new DateTime($row['violation_date'] . ' ' . $row['violation_time']);
            $violationDateTime = $dateTime->format('M d, Y • h:i A');
        }

        $violation = [
            'id' => (int)$row['id'],
            'caseId' => $row['case_id'] ?? '',
            'studentId' => $row['student_id'] ?? '',
            'studentName' => $fullName,
            'studentImage' => $avatar,
            'studentDept' => $row['student_dept'] ?? $row['department'] ?? '',
            'studentSection' => $row['student_section'] ?? $row['section'] ?? '',
            'studentContact' => $row['contact_number'] ?? 'N/A',
            'violationType' => $row['violation_type'] ?? '',
            'violationTypeLabel' => $violationTypeLabel,
            'violationLevel' => $row['violation_level'] ?? '',
            'violationLevelLabel' => $violationLevelLabel,
            'department' => $row['department'] ?? '',
            'section' => $row['section'] ?? '',
            'dateReported' => $row['violation_date'] ?? '',
            'violationTime' => $row['violation_time'] ?? '',
            'dateTime' => $violationDateTime,
            'location' => $row['location'] ?? '',
            'locationLabel' => $locationLabel,
            'reportedBy' => $row['reported_by'] ?? '',
            'status' => $row['status'] ?? 'warning',
            'statusLabel' => $statusLabel,
            'notes' => $row['notes'] ?? '',
            'attachments' => !empty($row['attachments']) ? json_decode($row['attachments'], true) : [],
            'created_at' => $row['created_at'] ?? '',
            'updated_at' => $row['updated_at'] ?? ''
        ];

        ob_clean();
        echo json_encode([
            'status' => 'success',
            'message' => 'Violation retrieved successfully',
            'violation' => $violation
        ]);
        exit;

    } catch (Exception $e) {
        if (isset($stmt)) {
            $stmt->close();
        }
        outputError('Database query error: ' . $e->getMessage());
    }
}

// Add new violation
function addViolation($conn) {
    // Get JSON input for API calls
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        // Fallback to POST data for form submissions
        $input = $_POST;
    }

    $studentId = htmlspecialchars(trim($input['studentId'] ?? ''));
    $violationType = htmlspecialchars(trim($input['violationType'] ?? ''));
    $violationLevel = htmlspecialchars(trim($input['violationLevel'] ?? ''));
    $violationDate = htmlspecialchars(trim($input['violationDate'] ?? ''));
    $violationTime = htmlspecialchars(trim($input['violationTime'] ?? ''));
    $location = htmlspecialchars(trim($input['location'] ?? ''));
    $reportedBy = htmlspecialchars(trim($input['reportedBy'] ?? ''));
    $status = htmlspecialchars(trim($input['status'] ?? 'warning'));
    $notes = htmlspecialchars(trim($input['notes'] ?? ''));

    // Validation
    if (empty($studentId) || empty($violationType) || empty($violationLevel) || empty($violationDate) || empty($violationTime) || empty($location) || empty($reportedBy)) {
        outputError('All required fields must be filled.');
    }

    // Get student information
    $studentQuery = "SELECT first_name, middle_name, last_name, department, section_id FROM students WHERE student_id = ?";
    $stmt = $conn->prepare($studentQuery);
    $stmt->bind_param("s", $studentId);
    $stmt->execute();
    $studentResult = $stmt->get_result();

    if ($studentResult->num_rows === 0) {
        outputError('Student not found.');
    }

    $student = $studentResult->fetch_assoc();
    $stmt->close();

    // Generate case ID
    $year = date('Y');
    $query = "SELECT COUNT(*) as count FROM violations WHERE YEAR(created_at) = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $year);
    $stmt->execute();
    $result = $stmt->get_result();
    $count = $result->fetch_assoc()['count'] + 1;
    $stmt->close();
    $caseId = sprintf('VIOL-%d-%03d', $year, $count);

    // Insert violation
    $query = "INSERT INTO violations 
              (case_id, student_id, violation_type, violation_level, department, section, violation_date, violation_time, location, reported_by, status, notes, created_at) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

    try {
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }

        $stmt->bind_param("ssssssssssss", 
            $caseId, 
            $studentId, 
            $violationType, 
            $violationLevel, 
            $student['department'], 
            $student['section_id'], 
            $violationDate, 
            $violationTime, 
            $location, 
            $reportedBy, 
            $status, 
            $notes
        );

        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }

        $violationId = $conn->insert_id;
        $stmt->close();

        ob_clean();
        echo json_encode([
            'status' => 'success',
            'message' => 'Violation recorded successfully!',
            'violationId' => $violationId,
            'caseId' => $caseId
        ]);
        exit;

    } catch (Exception $e) {
        if (isset($stmt)) {
            $stmt->close();
        }
        outputError('Failed to save violation: ' . $e->getMessage());
    }
}

// Update violation
function updateViolation($conn, $id) {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        $input = $_POST;
    }

    $violationType = htmlspecialchars(trim($input['violationType'] ?? ''));
    $violationLevel = htmlspecialchars(trim($input['violationLevel'] ?? ''));
    $violationDate = htmlspecialchars(trim($input['violationDate'] ?? ''));
    $violationTime = htmlspecialchars(trim($input['violationTime'] ?? ''));
    $location = htmlspecialchars(trim($input['location'] ?? ''));
    $reportedBy = htmlspecialchars(trim($input['reportedBy'] ?? ''));
    $status = htmlspecialchars(trim($input['status'] ?? ''));
    $notes = htmlspecialchars(trim($input['notes'] ?? ''));

    // Validation
    if (empty($violationType) || empty($violationLevel) || empty($violationDate) || empty($violationTime) || empty($location) || empty($reportedBy) || empty($status)) {
        outputError('All required fields must be filled.');
    }

    $query = "UPDATE violations SET 
              violation_type = ?, 
              violation_level = ?, 
              violation_date = ?, 
              violation_time = ?, 
              location = ?, 
              reported_by = ?, 
              status = ?, 
              notes = ?, 
              updated_at = NOW() 
              WHERE id = ?";

    try {
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }

        $stmt->bind_param("ssssssssi", 
            $violationType, 
            $violationLevel, 
            $violationDate, 
            $violationTime, 
            $location, 
            $reportedBy, 
            $status, 
            $notes, 
            $id
        );

        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }

        if ($stmt->affected_rows === 0) {
            outputError('Violation not found or no changes made.');
        }

        $stmt->close();

        ob_clean();
        echo json_encode([
            'status' => 'success',
            'message' => 'Violation updated successfully!'
        ]);
        exit;

    } catch (Exception $e) {
        if (isset($stmt)) {
            $stmt->close();
        }
        outputError('Failed to update violation: ' . $e->getMessage());
    }
}

// Delete violation
function deleteViolation($conn, $id) {
    $query = "DELETE FROM violations WHERE id = ?";

    try {
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception('Prepare failed: ' . $conn->error);
        }

        $stmt->bind_param("i", $id);

        if (!$stmt->execute()) {
            throw new Exception('Execute failed: ' . $stmt->error);
        }

        if ($stmt->affected_rows === 0) {
            outputError('Violation not found.');
        }

        $stmt->close();

        ob_clean();
        echo json_encode([
            'status' => 'success',
            'message' => 'Violation deleted successfully!'
        ]);
        exit;

    } catch (Exception $e) {
        if (isset($stmt)) {
            $stmt->close();
        }
        outputError('Failed to delete violation: ' . $e->getMessage());
    }
}

$conn->close();
?>