<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../models/StudentModel.php';

class StudentController extends Controller {
    private $model;

    public function __construct() {
        ob_start();
        error_reporting(E_ALL);
        ini_set('display_errors', 0);
        ini_set('log_errors', 1);
        header('Content-Type: application/json');
        @session_start();
        
        $this->model = new StudentModel();
    }

    public function index() {
        $filter = $this->getGet('filter', 'all');
        $search = $this->getGet('search', '');
        
        try {
            $students = $this->model->getAllWithDetails($filter, $search);
            $this->success('Students retrieved successfully', $students);
        } catch (Exception $e) {
            $this->error('Failed to retrieve students: ' . $e->getMessage());
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

        $studentId = $this->sanitize($this->getPost('studentIdCode', $this->getPost('studentId', '')));
        $firstName = $this->sanitize($this->getPost('firstName', ''));
        $middleName = $this->sanitize($this->getPost('middleName', ''));
        $lastName = $this->sanitize($this->getPost('lastName', ''));
        $email = $this->sanitize($this->getPost('studentEmail', ''));
        $contact = $this->sanitize($this->getPost('studentContact', ''));
        $address = $this->sanitize($this->getPost('studentAddress', ''));
        $department = $this->sanitize($this->getPost('studentDept', ''));
        $sectionId = intval($this->getPost('studentSection', 0));
        $status = $this->sanitize($this->getPost('studentStatus', 'active'));
        $avatar = $this->sanitize($this->getPost('studentAvatar', ''));

        if (empty($studentId) || empty($firstName) || empty($lastName) || empty($email)) {
            $this->error('Student ID, First Name, Last Name, and Email are required.');
        }

        if ($this->model->studentIdExists($studentId)) {
            $this->error('Student ID already exists.');
        }

        if ($this->model->emailExists($email)) {
            $this->error('Email already exists.');
        }

        try {
            $data = [
                'student_id' => $studentId,
                'first_name' => $firstName,
                'middle_name' => $middleName ?: null,
                'last_name' => $lastName,
                'email' => $email,
                'contact_number' => $contact ?: null,
                'address' => $address ?: null,
                'department' => $department ?: null,
                'section_id' => $sectionId ?: null,
                'avatar' => $avatar ?: null,
                'status' => $status,
                'created_at' => date('Y-m-d H:i:s')
            ];

            $id = $this->model->create($data);
            $this->success('Student added successfully!', ['id' => $id]);
        } catch (Exception $e) {
            $this->error('Failed to add student: ' . $e->getMessage());
        }
    }

    public function update() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->error('Invalid request method');
        }

        $id = intval($this->getPost('studentId', $this->getGet('id', 0)));
        if ($id === 0) {
            $this->error('Invalid student ID');
        }

        $studentId = $this->sanitize($this->getPost('studentIdCode', ''));
        $firstName = $this->sanitize($this->getPost('firstName', ''));
        $middleName = $this->sanitize($this->getPost('middleName', ''));
        $lastName = $this->sanitize($this->getPost('lastName', ''));
        $email = $this->sanitize($this->getPost('studentEmail', ''));
        $contact = $this->sanitize($this->getPost('studentContact', ''));
        $address = $this->sanitize($this->getPost('studentAddress', ''));
        $department = $this->sanitize($this->getPost('studentDept', ''));
        $sectionId = intval($this->getPost('studentSection', 0));
        $status = $this->sanitize($this->getPost('studentStatus', 'active'));
        $avatar = $this->sanitize($this->getPost('studentAvatar', ''));

        if (empty($studentId) || empty($firstName) || empty($lastName) || empty($email)) {
            $this->error('Student ID, First Name, Last Name, and Email are required.');
        }

        if ($this->model->studentIdExists($studentId, $id)) {
            $this->error('Student ID already exists.');
        }

        if ($this->model->emailExists($email, $id)) {
            $this->error('Email already exists.');
        }

        try {
            $data = [
                'student_id' => $studentId,
                'first_name' => $firstName,
                'middle_name' => $middleName ?: null,
                'last_name' => $lastName,
                'email' => $email,
                'contact_number' => $contact ?: null,
                'address' => $address ?: null,
                'department' => $department ?: null,
                'section_id' => $sectionId ?: null,
                'avatar' => $avatar ?: null,
                'status' => $status,
                'updated_at' => date('Y-m-d H:i:s')
            ];

            $this->model->update($id, $data);
            $this->success('Student updated successfully!');
        } catch (Exception $e) {
            $this->error('Failed to update student: ' . $e->getMessage());
        }
    }

    public function delete() {
        $id = intval($this->getGet('id', $this->getPost('id', 0)));
        
        if ($id === 0) {
            $this->error('Invalid student ID');
        }

        try {
            $this->model->archive($id);
            $this->success('Student archived successfully!');
        } catch (Exception $e) {
            $this->error('Failed to archive student: ' . $e->getMessage());
        }
    }

    public function restore() {
        $id = intval($this->getGet('id', $this->getPost('id', 0)));
        
        if ($id === 0) {
            $this->error('Invalid student ID');
        }

        try {
            $this->model->restore($id);
            $this->success('Student restored successfully!');
        } catch (Exception $e) {
            $this->error('Failed to restore student: ' . $e->getMessage());
        }
    }
}

