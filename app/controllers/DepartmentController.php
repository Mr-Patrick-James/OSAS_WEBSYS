<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../models/DepartmentModel.php';

class DepartmentController extends Controller {
    private $model;

    public function __construct() {
        ob_start();
        header('Content-Type: application/json');
        @session_start();
        $this->model = new DepartmentModel();
    }

    public function index() {
        $filter = $this->getGet('filter', 'all');
        $search = $this->getGet('search', '');
        
        try {
            $departments = $this->model->getAllWithFilters($filter, $search);
            $this->success('Departments retrieved successfully', $departments);
        } catch (Exception $e) {
            $this->error('Failed to retrieve departments: ' . $e->getMessage());
        }
    }

    public function dropdown() {
        try {
            $departments = $this->model->getForDropdown();
            $this->success('Departments retrieved successfully', $departments);
        } catch (Exception $e) {
            $this->error('Failed to retrieve departments: ' . $e->getMessage());
        }
    }

    public function stats() {
        try {
            $stats = $this->model->getStats();
            $this->success('Statistics retrieved successfully', $stats);
        } catch (Exception $e) {
            $this->error('Failed to retrieve statistics: ' . $e->getMessage());
        }
    }

    public function create() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->error('Invalid request method');
        }

        $name = $this->sanitize($this->getPost('departmentName', ''));
        $code = $this->sanitize($this->getPost('departmentCode', ''));

        if (empty($name) || empty($code)) {
            $this->error('Department name and code are required.');
        }

        if ($this->model->codeExists($code)) {
            $this->error('Department code already exists.');
        }

        try {
            $data = [
                'department_name' => $name,
                'department_code' => $code,
                'status' => 'active',
                'created_at' => date('Y-m-d H:i:s')
            ];

            $id = $this->model->create($data);
            $this->success('Department added successfully!', ['id' => $id]);
        } catch (Exception $e) {
            $this->error('Failed to add department: ' . $e->getMessage());
        }
    }

    public function update() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->error('Invalid request method');
        }

        $id = intval($this->getPost('departmentId', $this->getGet('id', 0)));
        if ($id === 0) {
            $this->error('Invalid department ID');
        }

        $name = $this->sanitize($this->getPost('departmentName', ''));
        $code = $this->sanitize($this->getPost('departmentCode', ''));

        if (empty($name) || empty($code)) {
            $this->error('Department name and code are required.');
        }

        if ($this->model->codeExists($code, $id)) {
            $this->error('Department code already exists.');
        }

        try {
            $data = [
                'department_name' => $name,
                'department_code' => $code,
                'updated_at' => date('Y-m-d H:i:s')
            ];

            $this->model->update($id, $data);
            $this->success('Department updated successfully!');
        } catch (Exception $e) {
            $this->error('Failed to update department: ' . $e->getMessage());
        }
    }

    public function delete() {
        $id = intval($this->getGet('id', $this->getPost('id', 0)));
        
        if ($id === 0) {
            $this->error('Invalid department ID');
        }

        try {
            $this->model->archive($id);
            $this->success('Department archived successfully!');
        } catch (Exception $e) {
            $this->error('Failed to archive department: ' . $e->getMessage());
        }
    }

    public function restore() {
        $id = intval($this->getGet('id', $this->getPost('id', 0)));
        
        if ($id === 0) {
            $this->error('Invalid department ID');
        }

        try {
            $this->model->restore($id);
            $this->success('Department restored successfully!');
        } catch (Exception $e) {
            $this->error('Failed to restore department: ' . $e->getMessage());
        }
    }
}

