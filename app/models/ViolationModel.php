<?php
require_once __DIR__ . '/../core/Model.php';

class ViolationModel extends Model {
    protected $table = 'violations';
    protected $primaryKey = 'id';

    /**
     * Get all violations with student info
     */
    public function getAllWithStudentInfo($filter = 'all', $search = '') {
        // Check if violations table exists
        $tableCheck = @$this->conn->query("SHOW TABLES LIKE 'violations'");
        if ($tableCheck === false || $tableCheck->num_rows === 0) {
            throw new Exception('Violations table does not exist. Please run the database setup SQL file: database/osas.sql');
        }
        
        // First, check if there are any violations at all (without JOIN)
        $countQuery = "SELECT COUNT(*) as total FROM violations";
        $countResult = $this->conn->query($countQuery);
        $totalCount = 0;
        if ($countResult) {
            $countRow = $countResult->fetch_assoc();
            $totalCount = (int)$countRow['total'];
        }
        
        error_log("ViolationsModel: Total violations in database: $totalCount");
        
        // If no violations exist, return empty array immediately
        if ($totalCount === 0) {
            error_log("ViolationsModel: No violations found in database, returning empty array");
            return [];
        }
        
        // Use LEFT JOIN so we get violations even if student doesn't exist
        // Fix collation mismatch by using BINARY comparison (case-sensitive but works with any collation)
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
                  LEFT JOIN students s ON BINARY v.student_id = BINARY s.student_id
                  WHERE 1=1";
        
        $params = [];
        $types = "";

        if ($filter === 'resolved') {
            $query .= " AND v.status = 'resolved'";
        } elseif ($filter === 'pending') {
            $query .= " AND v.status IN ('warning', 'permitted')";
        } elseif ($filter === 'disciplinary') {
            $query .= " AND v.status = 'disciplinary'";
        }

        if (!empty($search)) {
            $query .= " AND (v.case_id LIKE ? OR s.first_name LIKE ? OR s.last_name LIKE ? OR v.student_id LIKE ? OR v.violation_type LIKE ?)";
            $searchTerm = "%$search%";
            $params = array_fill(0, 5, $searchTerm);
            $types = "sssss";
        }

        $query .= " ORDER BY v.created_at DESC";

        try {
            // Debug: Log the query (remove in production)
            error_log("Violations Query: " . $query);
            error_log("Query params: " . print_r($params, true));
            
            $stmt = $this->conn->prepare($query);
            if (!$stmt) {
                $error = $this->conn->error;
                error_log("Prepare failed: " . $error);
                error_log("Query was: " . $query);
                throw new Exception('Prepare failed: ' . $error);
            }
            
            if (!empty($params) && !empty($types)) {
                if (!$stmt->bind_param($types, ...$params)) {
                    $error = $stmt->error;
                    error_log("Bind param failed: " . $error);
                    throw new Exception('Bind param failed: ' . $error);
                }
            }
            
            if (!$stmt->execute()) {
                $error = $stmt->error;
                error_log("Execute failed: " . $error);
                throw new Exception('Execute failed: ' . $error);
            }
            
            $result = $stmt->get_result();
            
            // Check if result is valid
            if ($result === false) {
                $error = $this->conn->error;
                error_log("Failed to get result: " . $error);
                throw new Exception('Failed to get result: ' . $error);
            }
            
            // Debug: Log row count
            $rowCount = $result ? $result->num_rows : 0;
            error_log("Violations query returned $rowCount rows");
            
        } catch (Exception $e) {
            if (isset($stmt)) {
                $stmt->close();
            }
            error_log("Violations query error: " . $e->getMessage());
            throw new Exception('Database query error: ' . $e->getMessage());
        }

        $violations = [];
        
        // Check if result is valid and has rows
        if ($result === false) {
            error_log("ViolationsModel: Result is false, query may have failed");
            $stmt->close();
            return [];
        }
        
        if ($result && $result->num_rows > 0) {
            error_log("ViolationsModel: Processing " . $result->num_rows . " rows");
            while ($row = $result->fetch_assoc()) {
                $firstName = $row['first_name'] ?? '';
                $middleName = $row['middle_name'] ?? '';
                $lastName = $row['last_name'] ?? '';
                $fullName = trim($firstName . ' ' . ($middleName ? $middleName . ' ' : '') . $lastName);
                
                // If no student name from JOIN, use student_id as fallback
                if (empty($fullName)) {
                    $fullName = 'Student ' . ($row['student_id'] ?? 'Unknown');
                }

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
        }

        if (isset($stmt)) {
            $stmt->close();
        }
        
        // Log final count
        error_log("ViolationsModel: Returning " . count($violations) . " violations");
        
        // If no violations returned but query succeeded, log a warning
        if (count($violations) === 0 && $totalCount > 0) {
            error_log("WARNING: ViolationsModel query returned 0 rows but database has $totalCount violations. Check if JOIN is working or if filters are too restrictive.");
        } elseif (count($violations) === 0 && $totalCount === 0) {
            error_log("INFO: No violations in database (count is 0)");
        }
        
        return $violations;
    }

    /**
     * Generate case ID
     */
    public function generateCaseId() {
        $year = date('Y');
        $result = $this->query("SELECT COUNT(*) as count FROM violations WHERE YEAR(created_at) = ?", [$year]);
        $count = ($result[0]['count'] ?? 0) + 1;
        return sprintf('VIOL-%d-%03d', $year, $count);
    }
}

