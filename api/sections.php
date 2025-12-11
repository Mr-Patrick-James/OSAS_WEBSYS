<?php
// api/sections.php - API endpoint for Sections CRUD operations
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
        getSections($conn);
        break;
    case 'add':
        addSection($conn);
        break;
    case 'update':
        updateSection($conn);
        break;
    case 'delete':
        deleteSection($conn);
        break;
    case 'archive':
        archiveSection($conn);
        break;
    case 'restore':
        restoreSection($conn);
        break;
    case 'stats':
        getStats($conn);
        break;
    default:
        // If no action, handle based on HTTP method
        if ($method === 'GET') {
            getSections($conn);
        } elseif ($method === 'POST') {
            addSection($conn);
        } elseif ($method === 'PUT') {
            updateSection($conn);
        } elseif ($method === 'DELETE') {
            deleteSection($conn);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        }
        break;
}

// Get all sections
function getSections($conn) {
    // Check if tables exist
    $tablesCheck = $conn->query("SHOW TABLES LIKE 'sections'");
    if ($tablesCheck->num_rows === 0) {
        echo json_encode([
            'status' => 'error', 
            'message' => 'Sections table does not exist. Please run the database setup SQL files first.',
            'data' => []
        ]);
        exit;
    }
    
    $filter = $_GET['filter'] ?? 'all';
    $search = $_GET['search'] ?? '';
    
    // Check if students table exists for student count
    $studentsTableExists = $conn->query("SHOW TABLES LIKE 'students'")->num_rows > 0;
    
    if ($studentsTableExists) {
        $query = "SELECT s.*, d.department_name, 
                  (SELECT COUNT(*) FROM students WHERE section_id = s.id) as student_count
                  FROM sections s
                  LEFT JOIN departments d ON s.department_id = d.id
                  WHERE 1=1";
    } else {
        $query = "SELECT s.*, d.department_name, 0 as student_count
                  FROM sections s
                  LEFT JOIN departments d ON s.department_id = d.id
                  WHERE 1=1";
    }
    
    $params = [];
    $types = "";
    
    if ($filter === 'active') {
        $query .= " AND s.status = 'active'";
    } elseif ($filter === 'archived') {
        $query .= " AND s.status = 'archived'";
    }
    
    if (!empty($search)) {
        $query .= " AND (s.section_name LIKE ? OR s.section_code LIKE ? OR d.department_name LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $types .= "sss";
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
    
    $sections = [];
    while ($row = $result->fetch_assoc()) {
        $sections[] = [
            'id' => $row['id'],
            'section_id' => $row['section_code'] ?: 'SEC-' . str_pad($row['id'], 3, '0', STR_PAD_LEFT),
            'name' => $row['section_name'],
            'code' => $row['section_code'],
            'department' => $row['department_name'] ?: 'N/A',
            'department_id' => $row['department_id'],
            'student_count' => (int)$row['student_count'],
            'academic_year' => $row['academic_year'],
            'date' => date('M d, Y', strtotime($row['created_at'])),
            'status' => $row['status']
        ];
    }
    
    echo json_encode(['status' => 'success', 'data' => $sections]);
    $stmt->close();
}

// Add new section
function addSection($conn) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        exit;
    }
    
    $sectionName = htmlspecialchars(trim($_POST['sectionName'] ?? ''));
    $sectionCode = htmlspecialchars(trim($_POST['sectionCode'] ?? ''));
    $departmentId = intval($_POST['sectionDepartment'] ?? 0);
    $academicYear = htmlspecialchars(trim($_POST['academicYear'] ?? ''));
    $status = htmlspecialchars(trim($_POST['sectionStatus'] ?? 'active'));
    
    // Validation
    if (empty($sectionName) || empty($sectionCode) || empty($departmentId) || empty($academicYear)) {
        echo json_encode(['status' => 'error', 'message' => 'All required fields must be filled out.']);
        exit;
    }
    
    // Check if section code already exists
    $check = $conn->prepare("SELECT id FROM sections WHERE section_code = ?");
    if (!$check) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    $check->bind_param("s", $sectionCode);
    $check->execute();
    $result = $check->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Section code already exists.']);
        $check->close();
        exit;
    }
    $check->close();
    
    // Insert section
    $insert = $conn->prepare("
        INSERT INTO sections (section_name, section_code, department_id, academic_year, status, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    
    if (!$insert) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $insert->bind_param("ssiss", $sectionName, $sectionCode, $departmentId, $academicYear, $status);
    
    if ($insert->execute()) {
        echo json_encode([
            'status' => 'success', 
            'message' => 'Section added successfully!'
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to add section: ' . $conn->error]);
    }
    
    $insert->close();
}

// Update section
function updateSection($conn) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        exit;
    }
    
    $sectionId = intval($_POST['sectionId'] ?? 0);
    $sectionName = htmlspecialchars(trim($_POST['sectionName'] ?? ''));
    $sectionCode = htmlspecialchars(trim($_POST['sectionCode'] ?? ''));
    $departmentId = intval($_POST['sectionDepartment'] ?? 0);
    $academicYear = htmlspecialchars(trim($_POST['academicYear'] ?? ''));
    $status = htmlspecialchars(trim($_POST['sectionStatus'] ?? 'active'));
    
    if ($sectionId === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid section ID']);
        exit;
    }
    
    // Validation
    if (empty($sectionName) || empty($sectionCode) || empty($departmentId) || empty($academicYear)) {
        echo json_encode(['status' => 'error', 'message' => 'All required fields must be filled out.']);
        exit;
    }
    
    // Check if section code already exists (excluding current section)
    $check = $conn->prepare("SELECT id FROM sections WHERE section_code = ? AND id != ?");
    if (!$check) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    $check->bind_param("si", $sectionCode, $sectionId);
    $check->execute();
    $result = $check->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Section code already exists.']);
        $check->close();
        exit;
    }
    $check->close();
    
    // Update section
    $update = $conn->prepare("
        UPDATE sections 
        SET section_name = ?, section_code = ?, department_id = ?, academic_year = ?, status = ?, updated_at = NOW()
        WHERE id = ?
    ");
    
    if (!$update) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $update->bind_param("ssissi", $sectionName, $sectionCode, $departmentId, $academicYear, $status, $sectionId);
    
    if ($update->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Section updated successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update section: ' . $conn->error]);
    }
    
    $update->close();
}

// Delete section (now archives instead of hard delete)
function deleteSection($conn) {
    $sectionId = intval($_GET['id'] ?? $_POST['id'] ?? 0);
    
    if ($sectionId === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid section ID']);
        exit;
    }
    
    // Archive section instead of hard delete
    $update = $conn->prepare("UPDATE sections SET status = 'archived', updated_at = NOW() WHERE id = ?");
    if (!$update) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $update->bind_param("i", $sectionId);
    
    if ($update->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Section archived successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to archive section: ' . $conn->error]);
    }
    
    $update->close();
}

// Archive section
function archiveSection($conn) {
    $sectionId = intval($_GET['id'] ?? $_POST['id'] ?? 0);
    
    if ($sectionId === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid section ID']);
        exit;
    }
    
    $update = $conn->prepare("UPDATE sections SET status = 'archived', updated_at = NOW() WHERE id = ?");
    if (!$update) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $update->bind_param("i", $sectionId);
    
    if ($update->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Section archived successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to archive section: ' . $conn->error]);
    }
    
    $update->close();
}

// Restore section
function restoreSection($conn) {
    $sectionId = intval($_GET['id'] ?? $_POST['id'] ?? 0);
    
    if ($sectionId === 0) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid section ID']);
        exit;
    }
    
    $update = $conn->prepare("UPDATE sections SET status = 'active', updated_at = NOW() WHERE id = ?");
    if (!$update) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }
    
    $update->bind_param("i", $sectionId);
    
    if ($update->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Section restored successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to restore section: ' . $conn->error]);
    }
    
    $update->close();
}

// Get statistics
function getStats($conn) {
    $total = $conn->query("SELECT COUNT(*) as count FROM sections")->fetch_assoc()['count'];
    $active = $conn->query("SELECT COUNT(*) as count FROM sections WHERE status = 'active'")->fetch_assoc()['count'];
    $archived = $conn->query("SELECT COUNT(*) as count FROM sections WHERE status = 'archived'")->fetch_assoc()['count'];
    
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

