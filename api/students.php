<?php
// api/students.php - API endpoint for Students CRUD operations
session_start();
require_once '../config/db_connect.php';

// Set JSON response header and disable error display
header('Content-Type: application/json');
error_reporting(0); // Disable error reporting to prevent HTML output
ini_set('display_errors', 0);

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Handle different actions
switch ($action) {
    case 'get':
        getStudents($conn);
        break;
    case 'add':
        addStudent($conn);
        break;
    case 'update':
        updateStudent($conn);
        break;
    case 'delete':
        deleteStudent($conn);
        break;
    case 'restore':
        restoreStudent($conn);
        break;
    case 'stats':
        getStats($conn);
        break;
    default:
        if ($method === 'GET') {
            getStudents($conn);
        } elseif ($method === 'POST') {
            addStudent($conn);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
        }
        break;
}

// Get all students
function getStudents($conn) {
    // Check if tables exist
    $tablesCheck = $conn->query("SHOW TABLES LIKE 'students'");
    if ($tablesCheck->num_rows === 0) {
        echo json_encode([
            'status' => 'error', 
            'message' => 'Students table does not exist. Please run the database setup SQL files first.',
            'data' => []
        ]);
        exit;
    }
    
    $filter = $_GET['filter'] ?? 'all';
    $search = $_GET['search'] ?? '';
    
    $query = "SELECT s.id, s.student_id, s.first_name, s.middle_name, s.last_name, 
                     s.email, s.contact_number, s.address, s.department, s.section_id, 
                     s.avatar, s.status, s.created_at, s.updated_at,
                     COALESCE(sec.section_name, 'N/A') as section_name, 
                     COALESCE(sec.section_code, 'N/A') as section_code, 
                     COALESCE(d.department_name, s.department) as department_name
              FROM students s
              LEFT JOIN sections sec ON s.section_id = sec.id
              LEFT JOIN departments d ON s.department = d.department_code
              WHERE 1=1";
    
    $params = [];
    $types = "";
    
    if ($filter === 'active') {
        $query .= " AND s.status = 'active'";
    } elseif ($filter === 'inactive') {
        $query .= " AND s.status = 'inactive'";
    } elseif ($filter === 'graduating') {
        $query .= " AND s.status = 'graduating'";
    } elseif ($filter === 'archived') {
        $query .= " AND s.status = 'archived'";
    } else {
        // For 'all', exclude archived by default
        $query .= " AND s.status != 'archived'";
    }
    
    if (!empty($search)) {
        $query .= " AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.middle_name LIKE ? OR s.student_id LIKE ? OR s.email LIKE ? OR s.department LIKE ? OR d.department_name LIKE ? OR sec.section_code LIKE ? OR sec.section_name LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $types .= "sssssssss";
    }
    
    $query .= " ORDER BY s.created_at DESC";
    
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    if (!$stmt->execute()) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $stmt->error]);
        $stmt->close();
        exit;
    }
    
    $result = $stmt->get_result();
    
    // Debug: Check if we got any results
    $numRows = $result->num_rows;
    
    $students = [];
    while ($row = $result->fetch_assoc()) {
        // Safely get values with defaults
        $firstName = $row['first_name'] ?? '';
        $middleName = $row['middle_name'] ?? '';
        $lastName = $row['last_name'] ?? '';
        $fullName = trim($firstName . ' ' . ($middleName ? $middleName . ' ' : '') . $lastName);
        
        // Generate avatar URL if not exists
        $avatar = $row['avatar'] ?? '';
        if (empty($avatar)) {
            $avatar = 'https://ui-avatars.com/api/?name=' . urlencode($fullName) . '&background=ffd700&color=333&size=40';
        }
        
        $students[] = [
            'id' => $row['id'] ?? 0,
            'studentId' => $row['student_id'] ?? '',
            'firstName' => $firstName,
            'middleName' => $middleName,
            'lastName' => $lastName,
            'email' => $row['email'] ?? '',
            'contact' => $row['contact_number'] ?: 'N/A',
            'address' => $row['address'] ?: '',
            'department' => $row['department_name'] ?? ($row['department'] ?? 'N/A'),
            'section' => $row['section_code'] ?? 'N/A',
            'section_id' => $row['section_id'] ?? null,
            'status' => $row['status'] ?? 'active',
            'avatar' => $avatar,
            'date' => isset($row['created_at']) ? date('M d, Y', strtotime($row['created_at'])) : date('M d, Y')
        ];
    }
    
    // Return response
    $response = [
        'status' => 'success', 
        'data' => $students
    ];
    
    // Add debug info if no students found
    if (count($students) === 0) {
        $response['debug'] = [
            'query_rows' => $numRows,
            'filter' => $filter,
            'search' => $search,
            'message' => 'No students found. Make sure you have inserted student data using the SQL insert queries.'
        ];
    }
    
    echo json_encode($response);
    $stmt->close();
}

// Add new student
function addStudent($conn) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        exit;
    }
    
    $studentId = htmlspecialchars(trim($_POST['studentId'] ?? ''));
    $firstName = htmlspecialchars(trim($_POST['firstName'] ?? ''));
    $middleName = htmlspecialchars(trim($_POST['middleName'] ?? ''));
    $lastName = htmlspecialchars(trim($_POST['lastName'] ?? ''));
    $email = htmlspecialchars(trim($_POST['studentEmail'] ?? ''));
    $contact = htmlspecialchars(trim($_POST['studentContact'] ?? ''));
    $address = htmlspecialchars(trim($_POST['studentAddress'] ?? ''));
    $department = htmlspecialchars(trim($_POST['studentDept'] ?? ''));
    $sectionId = intval($_POST['studentSection'] ?? 0);
    $status = htmlspecialchars(trim($_POST['studentStatus'] ?? 'active'));
    $avatar = htmlspecialchars(trim($_POST['studentAvatar'] ?? ''));
    
    // Validation
    if (empty($studentId) || empty($firstName) || empty($lastName) || empty($email)) {
        echo json_encode(['status' => 'error', 'message' => 'Student ID, First Name, Last Name, and Email are required.']);
        exit;
    }
    
    // Check if student ID already exists
    $check = $conn->prepare("SELECT id FROM students WHERE student_id = ?");
    if (!$check) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    $check->bind_param("s", $studentId);
    $check->execute();
    $result = $check->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Student ID already exists.']);
        $check->close();
        exit;
    }
    $check->close();
    
    // Check if email already exists
    $checkEmail = $conn->prepare("SELECT id FROM students WHERE email = ?");
    $checkEmail->bind_param("s", $email);
    $checkEmail->execute();
    $emailResult = $checkEmail->get_result();
    
    if ($emailResult->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email already exists.']);
        $checkEmail->close();
        exit;
    }
    $checkEmail->close();
    
    // Insert student
    $insert = $conn->prepare("
        INSERT INTO students (student_id, first_name, middle_name, last_name, email, contact_number, address, department, section_id, avatar, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    
    if (!$insert) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $insert->bind_param("ssssssssiss", $studentId, $firstName, $middleName, $lastName, $email, $contact, $address, $department, $sectionId, $avatar, $status);
    
    if ($insert->execute()) {
        echo json_encode([
            'status' => 'success', 
            'message' => 'Student added successfully!'
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add student: ' . $conn->error]);
    }
    
    $insert->close();
}

// Update student
function updateStudent($conn) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        exit;
    }
    
    $id = intval($_POST['studentId'] ?? $_GET['id'] ?? 0);
    $studentId = htmlspecialchars(trim($_POST['studentIdCode'] ?? ''));
    $firstName = htmlspecialchars(trim($_POST['firstName'] ?? ''));
    $middleName = htmlspecialchars(trim($_POST['middleName'] ?? ''));
    $lastName = htmlspecialchars(trim($_POST['lastName'] ?? ''));
    $email = htmlspecialchars(trim($_POST['studentEmail'] ?? ''));
    $contact = htmlspecialchars(trim($_POST['studentContact'] ?? ''));
    $address = htmlspecialchars(trim($_POST['studentAddress'] ?? ''));
    $department = htmlspecialchars(trim($_POST['studentDept'] ?? ''));
    $sectionId = intval($_POST['studentSection'] ?? 0);
    $status = htmlspecialchars(trim($_POST['studentStatus'] ?? 'active'));
    $avatar = htmlspecialchars(trim($_POST['studentAvatar'] ?? ''));
    
    if ($id === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid student ID']);
        exit;
    }
    
    // Validation
    if (empty($studentId) || empty($firstName) || empty($lastName) || empty($email)) {
        echo json_encode(['status' => 'error', 'message' => 'Student ID, First Name, Last Name, and Email are required.']);
        exit;
    }
    
    // Check if student ID already exists (excluding current student)
    $check = $conn->prepare("SELECT id FROM students WHERE student_id = ? AND id != ?");
    if (!$check) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    $check->bind_param("si", $studentId, $id);
    $check->execute();
    $result = $check->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Student ID already exists.']);
        $check->close();
        exit;
    }
    $check->close();
    
    // Check if email already exists (excluding current student)
    $checkEmail = $conn->prepare("SELECT id FROM students WHERE email = ? AND id != ?");
    $checkEmail->bind_param("si", $email, $id);
    $checkEmail->execute();
    $emailResult = $checkEmail->get_result();
    
    if ($emailResult->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Email already exists.']);
        $checkEmail->close();
        exit;
    }
    $checkEmail->close();
    
    // Update student
    $update = $conn->prepare("
        UPDATE students 
        SET student_id = ?, first_name = ?, middle_name = ?, last_name = ?, email = ?, contact_number = ?, address = ?, department = ?, section_id = ?, avatar = ?, status = ?, updated_at = NOW()
        WHERE id = ?
    ");
    
    if (!$update) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $update->bind_param("ssssssssissi", $studentId, $firstName, $middleName, $lastName, $email, $contact, $address, $department, $sectionId, $avatar, $status, $id);
    
    if ($update->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Student updated successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update student: ' . $conn->error]);
    }
    
    $update->close();
}

// Delete student (now archives instead of hard delete)
function deleteStudent($conn) {
    $studentId = intval($_GET['id'] ?? $_POST['id'] ?? 0);
    
    if ($studentId === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid student ID']);
        exit;
    }
    
    // Archive student instead of hard delete
    $update = $conn->prepare("UPDATE students SET status = 'archived', updated_at = NOW() WHERE id = ?");
    if (!$update) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $update->bind_param("i", $studentId);
    
    if ($update->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Student archived successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to archive student: ' . $conn->error]);
    }
    
    $update->close();
}

// Restore student
function restoreStudent($conn) {
    $studentId = intval($_GET['id'] ?? $_POST['id'] ?? 0);
    
    if ($studentId === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid student ID']);
        exit;
    }
    
    $update = $conn->prepare("UPDATE students SET status = 'active', updated_at = NOW() WHERE id = ?");
    if (!$update) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $update->bind_param("i", $studentId);
    
    if ($update->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Student restored successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to restore student: ' . $conn->error]);
    }
    
    $update->close();
}

// Get statistics
function getStats($conn) {
    $total = $conn->query("SELECT COUNT(*) as count FROM students")->fetch_assoc()['count'];
    $active = $conn->query("SELECT COUNT(*) as count FROM students WHERE status = 'active'")->fetch_assoc()['count'];
    $inactive = $conn->query("SELECT COUNT(*) as count FROM students WHERE status = 'inactive'")->fetch_assoc()['count'];
    $graduating = $conn->query("SELECT COUNT(*) as count FROM students WHERE status = 'graduating'")->fetch_assoc()['count'];
    $archived = $conn->query("SELECT COUNT(*) as count FROM students WHERE status = 'archived'")->fetch_assoc()['count'];
    
    echo json_encode([
        'status' => 'success',
        'data' => [
            'total' => (int)$total,
            'active' => (int)$active,
            'inactive' => (int)$inactive,
            'graduating' => (int)$graduating,
            'archived' => (int)$archived
        ]
    ]);
}

$conn->close();
?>

