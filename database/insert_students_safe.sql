-- Safe INSERT query for 20 students (uses NULL for section_id if sections don't exist)
-- This version will work even if sections haven't been created yet
-- You can update section_id later after sections are created

INSERT INTO `students` (`student_id`, `first_name`, `middle_name`, `last_name`, `email`, `contact_number`, `address`, `department`, `section_id`, `status`) VALUES
-- Computer Science students (4)
('2024-001', 'John', 'Michael', 'Doe', 'john.doe@student.edu', '+63 912 345 6789', '123 Main Street, Quezon City', 'CS', NULL, 'active'),
('2024-002', 'Maria', 'Clara', 'Santos', 'maria.santos@student.edu', '+63 923 456 7890', '456 Oak Avenue, Manila', 'CS', NULL, 'active'),
('2024-003', 'Robert', 'James', 'Chen', 'robert.chen@student.edu', '+63 934 567 8901', '789 Pine Road, Makati', 'CS', NULL, 'active'),
('2024-015', 'James', 'Ryan', 'Bautista', 'james.bautista@student.edu', '+63 956 789 0123', '468 Cedar Heights, Malabon', 'CS', NULL, 'graduating'),
-- Business Administration students (4)
('2024-004', 'Anna', 'Marie', 'Rodriguez', 'anna.rodriguez@student.edu', '+63 945 678 9012', '321 Elm Street, Pasig', 'BA', NULL, 'active'),
('2024-005', 'Michael', 'Anthony', 'Garcia', 'michael.garcia@student.edu', '+63 956 789 0123', '654 Maple Drive, Taguig', 'BA', NULL, 'active'),
('2024-006', 'Sarah', 'Jane', 'Lopez', 'sarah.lopez@student.edu', '+63 967 890 1234', '987 Cedar Lane, Mandaluyong', 'BA', NULL, 'active'),
('2024-016', 'Angela', 'Faith', 'Mendoza', 'angela.mendoza@student.edu', '+63 967 890 1234', '579 Birch Valley, Pasay', 'BA', NULL, 'active'),
-- Nursing students (4)
('2024-007', 'David', 'Paul', 'Martinez', 'david.martinez@student.edu', '+63 978 901 2345', '147 Birch Court, San Juan', 'NUR', NULL, 'active'),
('2024-008', 'Jennifer', 'Rose', 'Torres', 'jennifer.torres@student.edu', '+63 989 012 3456', '258 Spruce Way, Marikina', 'NUR', NULL, 'active'),
('2024-009', 'Christopher', 'Lee', 'Reyes', 'christopher.reyes@student.edu', '+63 990 123 4567', '369 Willow Street, Caloocan', 'NUR', NULL, 'active'),
('2024-017', 'Kevin', 'John', 'Aquino', 'kevin.aquino@student.edu', '+63 978 901 2345', '680 Spruce Ridge, Pateros', 'NUR', NULL, 'active'),
-- BSIS students (3)
('2024-010', 'Patricia', 'Ann', 'Cruz', 'patricia.cruz@student.edu', '+63 901 234 5678', '741 Ash Avenue, Valenzuela', 'BSIS', NULL, 'active'),
('2024-011', 'Daniel', 'Mark', 'Fernandez', 'daniel.fernandez@student.edu', '+63 912 345 6789', '852 Oak Boulevard, Las Pinas', 'BSIS', NULL, 'active'),
('2024-018', 'Nicole', 'Anne', 'Castillo', 'nicole.castillo@student.edu', '+63 989 012 3456', '791 Willow Park, Taguig', 'BSIS', NULL, 'inactive'),
-- WFT students (3)
('2024-012', 'Michelle', 'Grace', 'Villanueva', 'michelle.villanueva@student.edu', '+63 923 456 7890', '963 Pine Circle, Paranaque', 'WFT', NULL, 'active'),
('2024-013', 'Mark', 'Joseph', 'Ramos', 'mark.ramos@student.edu', '+63 934 567 8901', '159 Elm Plaza, Muntinlupa', 'WFT', NULL, 'active'),
('2024-019', 'Ryan', 'Patrick', 'Morales', 'ryan.morales@student.edu', '+63 990 123 4567', '802 Ash Gardens, Makati', 'WFT', NULL, 'active'),
-- BTVTEd students (2)
('2024-014', 'Lisa', 'Marie', 'Delos Santos', 'lisa.delossantos@student.edu', '+63 945 678 9012', '357 Maple Square, Navotas', 'BTVTEd', NULL, 'active'),
('2024-020', 'Christine', 'Joy', 'Rivera', 'christine.rivera@student.edu', '+63 901 234 5678', '913 Pine Meadows, Quezon City', 'BTVTEd', NULL, 'active')
ON DUPLICATE KEY UPDATE `first_name`=`first_name`;

-- After running this, you can update section_id values using:
-- UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'CS-SEC-A' LIMIT 1) WHERE student_id = '2024-001';
-- (Repeat for each student)

