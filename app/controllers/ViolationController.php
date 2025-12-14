<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../models/ViolationModel.php';
require_once __DIR__ . '/../models/StudentModel.php';

class ViolationController extends Controller {
    private $model;
    private $studentModel;

    public function __construct() {
        // Don't start output buffering here - let the API wrapper handle it
        header('Content-Type: application/json');
        @session_start();
        $this->model = new ViolationModel();
        $this->studentModel = new StudentModel();
    }

    public function index() {
        $filter = $this->getGet('filter', 'all');
        $search = $this->getGet('search', '');
        
        try {
            $violations = $this->model->getAllWithStudentInfo($filter, $search);
            
            // Log for debugging
            error_log("ViolationsController: Retrieved " . count($violations) . " violations");
            
            // Always return success, even if array is empty
            // This helps distinguish between "no data" and "error"
            $response = [
                'status' => 'success',
                'message' => count($violations) > 0 ? 'Violations retrieved successfully' : 'No violations found',
                'violations' => $violations,
                'data' => $violations, // Also include as 'data' for backward compatibility
                'count' => count($violations)
            ];
            
            // Log the response structure for debugging
            error_log("ViolationsController: Response structure - status: " . $response['status'] . ", count: " . $response['count']);
            
            $this->json($response);
        } catch (Exception $e) {
            // Log the full error
            error_log("ViolationsController Error: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            
            $this->error('Failed to retrieve violations: ' . $e->getMessage(), 'Please check if the violations table exists and has the correct structure.');
        }
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->error('Invalid request method');
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            $input = $_POST;
        }

        $studentId = $this->sanitize($input['studentId'] ?? '');
        $violationType = $this->sanitize($input['violationType'] ?? '');
        $violationLevel = $this->sanitize($input['violationLevel'] ?? '');
        $violationDate = $this->sanitize($input['violationDate'] ?? '');
        $violationTime = $this->sanitize($input['violationTime'] ?? '');
        $location = $this->sanitize($input['location'] ?? '');
        $reportedBy = $this->sanitize($input['reportedBy'] ?? '');
        $status = $this->sanitize($input['status'] ?? 'warning');
        $notes = $this->sanitize($input['notes'] ?? '');

        if (empty($studentId) || empty($violationType) || empty($violationLevel) || 
            empty($violationDate) || empty($violationTime) || empty($location) || empty($reportedBy)) {
            $this->error('All required fields must be filled.');
        }

        // Get student info
        $student = $this->studentModel->query(
            "SELECT s.first_name, s.middle_name, s.last_name, 
                    COALESCE(d.department_name, s.department, 'N/A') as department_name,
                    s.department as department_code,
                    s.section_id 
             FROM students s
             LEFT JOIN departments d ON s.department = d.department_code
             WHERE s.student_id = ?",
            [$studentId]
        );

        if (empty($student)) {
            $this->error('Student not found.');
        }

        $student = $student[0];
        $department = !empty($student['department_code']) ? $student['department_code'] : 
                      (!empty($student['department_name']) && $student['department_name'] !== 'N/A' ? $student['department_name'] : 'N/A');

        if (empty($department) || $department === 'N/A') {
            $department = $this->sanitize($input['department'] ?? '');
        }

        if (empty($department) || $department === 'N/A') {
            $this->error('Student department is required. Please ensure the student has a department assigned.');
        }

        try {
            $caseId = $this->model->generateCaseId();
            
            $data = [
                'case_id' => $caseId,
                'student_id' => $studentId,
                'violation_type' => $violationType,
                'violation_level' => $violationLevel,
                'department' => $department,
                'section' => $student['section_id'] ?? '',
                'violation_date' => $violationDate,
                'violation_time' => $violationTime,
                'location' => $location,
                'reported_by' => $reportedBy,
                'status' => $status,
                'notes' => $notes ?: null,
                'created_at' => date('Y-m-d H:i:s')
            ];

            $id = $this->model->create($data);
            $this->success('Violation recorded successfully!', [
                'violationId' => $id,
                'caseId' => $caseId
            ]);
        } catch (Exception $e) {
            $this->error('Failed to save violation: ' . $e->getMessage());
        }
    }

    public function update() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'PUT') {
            $this->error('Invalid request method');
        }

        $id = intval($this->getGet('id', 0));
        if ($id === 0) {
            $this->error('Violation ID required');
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            $input = $_POST;
        }

        // Get current violation
        $current = $this->model->getById($id);
        if (!$current) {
            $this->error('Violation not found.');
        }

        $violationType = !empty($input['violationType']) ? $this->sanitize($input['violationType']) : $current['violation_type'];
        $violationLevel = !empty($input['violationLevel']) ? $this->sanitize($input['violationLevel']) : $current['violation_level'];
        $violationDate = !empty($input['violationDate']) ? $this->sanitize($input['violationDate']) : $current['violation_date'];
        $violationTime = !empty($input['violationTime']) ? $this->sanitize($input['violationTime']) : $current['violation_time'];
        $location = !empty($input['location']) ? $this->sanitize($input['location']) : $current['location'];
        $reportedBy = !empty($input['reportedBy']) ? $this->sanitize($input['reportedBy']) : $current['reported_by'];
        $status = !empty($input['status']) ? $this->sanitize($input['status']) : $current['status'];
        $notes = isset($input['notes']) ? $this->sanitize($input['notes']) : $current['notes'];

        if (empty($violationType) || empty($violationLevel) || empty($violationDate) || 
            empty($violationTime) || empty($location) || empty($reportedBy) || empty($status)) {
            $this->error('All required fields must be filled.');
        }

        try {
            $data = [
                'violation_type' => $violationType,
                'violation_level' => $violationLevel,
                'violation_date' => $violationDate,
                'violation_time' => $violationTime,
                'location' => $location,
                'reported_by' => $reportedBy,
                'status' => $status,
                'notes' => $notes,
                'updated_at' => date('Y-m-d H:i:s')
            ];

            $this->model->update($id, $data);
            $this->success('Violation updated successfully!');
        } catch (Exception $e) {
            $this->error('Failed to update violation: ' . $e->getMessage());
        }
    }

    public function delete() {
        $id = intval($this->getGet('id', 0));
        
        if ($id === 0) {
            $this->error('Violation ID required');
        }

        try {
            $this->model->delete($id);
            $this->success('Violation deleted successfully!');
        } catch (Exception $e) {
            $this->error('Failed to delete violation: ' . $e->getMessage());
        }
    }
}

