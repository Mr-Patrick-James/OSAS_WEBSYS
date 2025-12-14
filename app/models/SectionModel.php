<?php
require_once __DIR__ . '/../core/Model.php';

class SectionModel extends Model {
    protected $table = 'sections';
    protected $primaryKey = 'id';

    /**
     * Get sections by department
     */
    public function getByDepartment($departmentCode) {
        $query = "SELECT s.*, d.department_name, d.department_code 
                  FROM sections s
                  LEFT JOIN departments d ON s.department_id = d.id
                  WHERE d.department_code = ? AND s.status = 'active'
                  ORDER BY s.section_code ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("s", $departmentCode);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $sections = [];
        while ($row = $result->fetch_assoc()) {
            $sections[] = [
                'id' => (int)$row['id'],
                'section_code' => $row['section_code'] ?? '',
                'section_name' => $row['section_name'] ?? ''
            ];
        }
        
        $stmt->close();
        return $sections;
    }

    /**
     * Get all sections with filters
     */
    public function getAllWithFilters($filter = 'all', $search = '') {
        $query = "SELECT s.*, 
                         d.department_name, 
                         d.department_code,
                         COUNT(DISTINCT st.id) as student_count
                  FROM sections s
                  LEFT JOIN departments d ON s.department_id = d.id
                  LEFT JOIN students st ON s.id = st.section_id AND st.status != 'archived'
                  WHERE 1=1";
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
            $params = [$searchTerm, $searchTerm, $searchTerm];
            $types = "sss";
        }

        $query .= " GROUP BY s.id ORDER BY s.section_code ASC";

        $stmt = $this->conn->prepare($query);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();

        $sections = [];
        while ($row = $result->fetch_assoc()) {
            $sections[] = [
                'id' => (int)$row['id'],
                'section_id' => (int)$row['id'],
                'name' => $row['section_name'] ?? '',
                'code' => $row['section_code'] ?? '',
                'department' => $row['department_name'] ?? 'N/A',
                'department_id' => (int)($row['department_id'] ?? 0),
                'academic_year' => $row['academic_year'] ?? '',
                'student_count' => (int)($row['student_count'] ?? 0),
                'date' => isset($row['created_at']) ? date('M d, Y', strtotime($row['created_at'])) : date('M d, Y'),
                'status' => $row['status'] ?? 'active'
            ];
        }

        $stmt->close();
        return $sections;
    }

    /**
     * Check if section code exists
     */
    public function codeExists($code, $excludeId = null) {
        $query = "SELECT id FROM sections WHERE section_code = ?";
        if ($excludeId) {
            $query .= " AND id != ?";
            $result = $this->query($query, [$code, $excludeId]);
        } else {
            $result = $this->query($query, [$code]);
        }
        return count($result) > 0;
    }

    /**
     * Archive section
     */
    public function archive($id) {
        return $this->update($id, ['status' => 'archived', 'updated_at' => date('Y-m-d H:i:s')]);
    }

    /**
     * Restore section
     */
    public function restore($id) {
        return $this->update($id, ['status' => 'active', 'updated_at' => date('Y-m-d H:i:s')]);
    }
}

