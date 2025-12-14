<?php
require_once __DIR__ . '/../core/Model.php';

class UserModel extends Model {
    protected $table = 'users';
    protected $primaryKey = 'id';

    /**
     * Authenticate user
     */
    public function authenticate($username, $password) {
        $query = "SELECT * FROM users WHERE (username = ? OR email = ?) AND is_active = 1 LIMIT 1";
        $result = $this->query($query, [$username, $username]);
        
        if (count($result) === 1) {
            $user = $result[0];
            if (password_verify($password, $user['password'])) {
                return $user;
            }
        }
        
        return null;
    }

    /**
     * Check if username exists
     */
    public function usernameExists($username, $excludeId = null) {
        $query = "SELECT id FROM users WHERE username = ?";
        if ($excludeId) {
            $query .= " AND id != ?";
            $result = $this->query($query, [$username, $excludeId]);
        } else {
            $result = $this->query($query, [$username]);
        }
        return count($result) > 0;
    }

    /**
     * Check if email exists
     */
    public function emailExists($email, $excludeId = null) {
        $query = "SELECT id FROM users WHERE email = ?";
        if ($excludeId) {
            $query .= " AND id != ?";
            $result = $this->query($query, [$email, $excludeId]);
        } else {
            $result = $this->query($query, [$email]);
        }
        return count($result) > 0;
    }

    /**
     * Create user with hashed password
     */
    public function create($data) {
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        return parent::create($data);
    }
}

