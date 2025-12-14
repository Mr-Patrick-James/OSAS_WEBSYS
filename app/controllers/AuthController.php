<?php
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../models/UserModel.php';

class AuthController extends Controller {
    private $model;

    public function __construct() {
        ob_start();
        header('Content-Type: application/json');
        @session_start();
        $this->model = new UserModel();
    }

    public function login() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->error('Invalid request method');
        }

        $username = trim($this->getPost('username', ''));
        $password = trim($this->getPost('password', ''));
        $remember = isset($_POST['rememberMe']) && $_POST['rememberMe'] === 'true';

        if (empty($username) || empty($password)) {
            $this->error('Please fill in all fields.');
        }

        $user = $this->model->authenticate($username, $password);

        if ($user) {
            // Set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];

            $expiryTime = time() + ($remember ? 30*24*60*60 : 6*60*60);

            // Always set cookies for session persistence (even without remember me)
            // This ensures the session persists across page loads
            setcookie("user_id", $user['id'], $expiryTime, "/", "", false, false);
            setcookie("username", $user['username'], $expiryTime, "/", "", false, false);
            setcookie("role", $user['role'], $expiryTime, "/", "", false, false);

            $this->success('Login successful', [
                'role' => $user['role'],
                'name' => $user['username'],
                'studentId' => $user['id'],
                'expires' => $expiryTime
            ]);
        } else {
            $this->error('Invalid username or password.');
        }
    }

    public function logout() {
        session_start();
        session_destroy();
        setcookie("user_id", "", time() - 3600, "/");
        setcookie("username", "", time() - 3600, "/");
        setcookie("role", "", time() - 3600, "/");
        
        $this->success('Logged out successfully');
    }

    public function check() {
        session_start();
        if (isset($_SESSION['user_id'])) {
            $this->success('User is authenticated', [
                'user_id' => $_SESSION['user_id'],
                'username' => $_SESSION['username'],
                'role' => $_SESSION['role']
            ]);
        } else {
            $this->error('User is not authenticated', '', 401);
        }
    }
}

