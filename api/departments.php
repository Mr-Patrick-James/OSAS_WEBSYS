<?php
// api/departments.php - API endpoint for Departments CRUD operations
session_start();
require_once '../config/db_connect.php';

// Set JSON response header
header('Content-Type: application/json');

// Check if user is authenticated (optional - adjust based on your auth requirements)
// if (!isset($_SESSION['user_id'])) {
//     echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
//     exit;
// }

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Handle different actions
switch ($action) {
    case 'get':
        getDepartments($conn);
        break;
    case 'add':
        addDepartment($conn);
        break;
    case 'update':
        updateDepartment($conn);
        break;
    case 'delete':
        deleteDepartment($conn);
        break;
    case 'archive':
        archiveDepartment($conn);
        break;
    case 'restore':
        restoreDepartment($conn);
        break;
    case 'stats':
        getStats($conn);
        break;
    default:
        // If no action specified and it's a GET request, return departments (for dropdowns)
        if ($method === 'GET' && empty($action)) {
            getDepartmentsForDropdown($conn);
        } elseif ($method === 'GET') {
            getDepartments($conn);
        } elseif ($method === 'POST') {
            addDepartment($conn);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
        }
        break;
}

// Get departments for dropdown (simple list)
function getDepartmentsForDropdown($conn) {
    // Check if departments table exists
    $tableCheck = $conn->query("SHOW TABLES LIKE 'departments'");
    if ($tableCheck->num_rows === 0) {
        echo json_encode([
            'status' => 'error', 
            'message' => 'Departments table does not exist. Please run the database setup SQL files first.',
            'data' => []
        ]);
        exit;
    }

    $query = "SELECT id, department_name, department_code FROM departments WHERE status = 'active' ORDER BY department_name ASC";
    $result = $conn->query($query);

    if (!$result) {
        echo json_encode([
            'status' => 'error', 
            'message' => 'Database error: ' . $conn->error,
            'data' => []
        ]);
        exit;
    }

    $departments = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $departments[] = [
                'id' => $row['id'],
                'name' => $row['department_name'],
                'code' => $row['department_code']
            ];
        }
    }

    echo json_encode(['status' => 'success', 'data' => $departments]);
}

// Get all departments
function getDepartments($conn) {
    // Check if tables exist
    $tablesCheck = $conn->query("SHOW TABLES LIKE 'departments'");
    if ($tablesCheck->num_rows === 0) {
        echo json_encode([
            'status' => 'error', 
            'message' => 'Departments table does not exist. Please run the database setup SQL files first.',
            'data' => []
        ]);
        exit;
    }
    
    $filter = $_GET['filter'] ?? 'all';
    $search = $_GET['search'] ?? '';
    
    $query = "SELECT d.*, 
              (SELECT COUNT(*) FROM students WHERE department = d.department_code) as student_count
              FROM departments d
              WHERE 1=1";
    
    $params = [];
    $types = "";
    
    if ($filter === 'active') {
        $query .= " AND d.status = 'active'";
    } elseif ($filter === 'archived') {
        $query .= " AND d.status = 'archived'";
    }
    
    if (!empty($search)) {
        $query .= " AND (d.department_name LIKE ? OR d.department_code LIKE ? OR d.head_of_department LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $types .= "sss";
    }
    
    $query .= " ORDER BY d.created_at DESC";
    
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    
    $departments = [];
    while ($row = $result->fetch_assoc()) {
        $departments[] = [
            'id' => $row['id'],
            'department_id' => 'DEPT-' . str_pad($row['id'], 3, '0', STR_PAD_LEFT),
            'name' => $row['department_name'],
            'code' => $row['department_code'],
            'hod' => $row['head_of_department'] ?: 'N/A',
            'student_count' => (int)$row['student_count'],
            'date' => date('M d, Y', strtotime($row['created_at'])),
            'status' => $row['status'],
            'description' => $row['description'] ?: ''
        ];
    }
    
    echo json_encode(['status' => 'success', 'data' => $departments]);
    $stmt->close();
}

// Add new department
function addDepartment($conn) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        exit;
    }
    
    $deptName = htmlspecialchars(trim($_POST['deptName'] ?? ''));
    $deptCode = htmlspecialchars(trim($_POST['deptCode'] ?? ''));
    $hodName = htmlspecialchars(trim($_POST['hodName'] ?? ''));
    $deptDescription = htmlspecialchars(trim($_POST['deptDescription'] ?? ''));
    $status = htmlspecialchars(trim($_POST['deptStatus'] ?? 'active'));
    
    // Validation
    if (empty($deptName) || empty($deptCode)) {
        echo json_encode(['status' => 'error', 'message' => 'Department Name and Department Code are required.']);
        exit;
    }
    
    // Check if department code already exists
    $check = $conn->prepare("SELECT id FROM departments WHERE department_code = ?");
    if (!$check) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    $check->bind_param("s", $deptCode);
    $check->execute();
    $result = $check->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Department code already exists.']);
        $check->close();
        exit;
    }
    $check->close();
    
    // Insert department
    $insert = $conn->prepare("
        INSERT INTO departments (department_name, department_code, head_of_department, description, status, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    
    if (!$insert) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $insert->bind_param("sssss", $deptName, $deptCode, $hodName, $deptDescription, $status);
    
    if ($insert->execute()) {
        echo json_encode([
            'status' => 'success', 
            'message' => 'Department added successfully!'
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add department: ' . $conn->error]);
    }
    
    $insert->close();
}

// Update department
function updateDepartment($conn) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        exit;
    }
    
    $deptId = intval($_POST['deptId'] ?? 0);
    $deptName = htmlspecialchars(trim($_POST['deptName'] ?? ''));
    $deptCode = htmlspecialchars(trim($_POST['deptCode'] ?? ''));
    $hodName = htmlspecialchars(trim($_POST['hodName'] ?? ''));
    $deptDescription = htmlspecialchars(trim($_POST['deptDescription'] ?? ''));
    $status = htmlspecialchars(trim($_POST['deptStatus'] ?? 'active'));
    
    if ($deptId === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid department ID']);
        exit;
    }
    
    // Validation
    if (empty($deptName) || empty($deptCode)) {
        echo json_encode(['status' => 'error', 'message' => 'Department Name and Department Code are required.']);
        exit;
    }
    
    // Check if department code already exists (excluding current department)
    $check = $conn->prepare("SELECT id FROM departments WHERE department_code = ? AND id != ?");
    if (!$check) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    $check->bind_param("si", $deptCode, $deptId);
    $check->execute();
    $result = $check->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Department code already exists.']);
        $check->close();
        exit;
    }
    $check->close();
    
    // Update department
    $update = $conn->prepare("
        UPDATE departments 
        SET department_name = ?, department_code = ?, head_of_department = ?, description = ?, status = ?, updated_at = NOW()
        WHERE id = ?
    ");
    
    if (!$update) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $update->bind_param("sssssi", $deptName, $deptCode, $hodName, $deptDescription, $status, $deptId);
    
    if ($update->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Department updated successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update department: ' . $conn->error]);
    }
    
    $update->close();
}

// Delete department
function deleteDepartment($conn) {
    $deptId = intval($_GET['id'] ?? $_POST['id'] ?? 0);
    
    if ($deptId === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid department ID']);
        exit;
    }
    
    // Check if department has sections
    $check = $conn->prepare("SELECT COUNT(*) as count FROM sections WHERE department_id = ?");
    $check->bind_param("i", $deptId);
    $check->execute();
    $result = $check->get_result();
    $row = $result->fetch_assoc();
    $check->close();
    
    if ($row['count'] > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Cannot delete department with assigned sections.']);
        exit;
    }
    
    // Check if department has students (using department_code)
    $deptCodeQuery = $conn->prepare("SELECT department_code FROM departments WHERE id = ?");
    $deptCodeQuery->bind_param("i", $deptId);
    $deptCodeQuery->execute();
    $deptResult = $deptCodeQuery->get_result();
    if ($deptResult->num_rows > 0) {
        $deptRow = $deptResult->fetch_assoc();
        $deptCode = $deptRow['department_code'];
        
        $studentCheck = $conn->prepare("SELECT COUNT(*) as count FROM students WHERE department = ?");
        $studentCheck->bind_param("s", $deptCode);
        $studentCheck->execute();
        $studentResult = $studentCheck->get_result();
        $studentRow = $studentResult->fetch_assoc();
        $studentCheck->close();
        
        if ($studentRow['count'] > 0) {
            echo json_encode(['status' => 'error', 'message' => 'Cannot delete department with assigned students.']);
            $deptCodeQuery->close();
            exit;
        }
    }
    $deptCodeQuery->close();
    
    // Delete department
    $delete = $conn->prepare("DELETE FROM departments WHERE id = ?");
    if (!$delete) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $delete->bind_param("i", $deptId);
    
    if ($delete->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Department deleted successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to delete department: ' . $conn->error]);
    }
    
    $delete->close();
}

// Archive department
function archiveDepartment($conn) {
    $deptId = intval($_GET['id'] ?? $_POST['id'] ?? 0);
    
    if ($deptId === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid department ID']);
        exit;
    }
    
    $update = $conn->prepare("UPDATE departments SET status = 'archived', updated_at = NOW() WHERE id = ?");
    if (!$update) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $update->bind_param("i", $deptId);
    
    if ($update->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Department archived successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to archive department: ' . $conn->error]);
    }
    
    $update->close();
}

// Restore department
function restoreDepartment($conn) {
    $deptId = intval($_GET['id'] ?? $_POST['id'] ?? 0);
    
    if ($deptId === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid department ID']);
        exit;
    }
    
    $update = $conn->prepare("UPDATE departments SET status = 'active', updated_at = NOW() WHERE id = ?");
    if (!$update) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $update->bind_param("i", $deptId);
    
    if ($update->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Department restored successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to restore department: ' . $conn->error]);
    }
    
    $update->close();
}

// Get statistics
function getStats($conn) {
    $total = $conn->query("SELECT COUNT(*) as count FROM departments")->fetch_assoc()['count'];
    $active = $conn->query("SELECT COUNT(*) as count FROM departments WHERE status = 'active'")->fetch_assoc()['count'];
    $archived = $conn->query("SELECT COUNT(*) as count FROM departments WHERE status = 'archived'")->fetch_assoc()['count'];
    
    echo json_encode([
        'status' => 'success',
        'data' => [
            'total' => (int)$total,
            'active' => (int)$active,
            'archived' => (int)$archived
        ]
    ]);
}

$conn->close();
?>
