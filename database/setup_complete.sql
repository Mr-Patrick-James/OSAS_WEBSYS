-- =====================================================
-- Complete Database Setup for OSAS System
-- This file creates: departments, sections, and students tables
-- =====================================================
-- IMPORTANT: This will DROP existing tables if they exist!
-- Make sure to backup your data before running this script.
-- =====================================================

-- =====================================================
-- STEP 1: DROP TABLES (in reverse order of dependencies)
-- =====================================================

-- Drop students table first (has foreign key to sections)
DROP TABLE IF EXISTS `students`;

-- Drop sections table (has foreign key to departments)
DROP TABLE IF EXISTS `sections`;

-- Drop departments table
DROP TABLE IF EXISTS `departments`;

-- =====================================================
-- STEP 2: CREATE DEPARTMENTS TABLE
-- =====================================================

CREATE TABLE `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(255) NOT NULL,
  `department_code` varchar(50) NOT NULL UNIQUE,
  `head_of_department` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` enum('active','archived') DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- STEP 3: INSERT SAMPLE DEPARTMENTS
-- =====================================================

INSERT INTO `departments` (`department_name`, `department_code`, `status`) VALUES
('Computer Science', 'CS', 'active'),
('Business Administration', 'BA', 'active'),
('Nursing', 'NUR', 'active'),
('Bachelor of Science in Information System', 'BSIS', 'active'),
('Welding and Fabrication Technology', 'WFT', 'active'),
('Bachelor of Technical-Vocational Education and Training', 'BTVTEd', 'active'),
('BS Information Technology', 'BSIT', 'active'),
('BS Computer Science', 'BSCS', 'active'),
('BS Business Administration', 'BSBA', 'active'),
('BS Nursing', 'BSN', 'active'),
('Bachelor of Elementary Education', 'BEED', 'active'),
('Bachelor of Secondary Education', 'BSED', 'active')
ON DUPLICATE KEY UPDATE `department_name`=`department_name`;

-- =====================================================
-- STEP 4: CREATE SECTIONS TABLE
-- =====================================================

CREATE TABLE `sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `section_name` varchar(255) NOT NULL,
  `section_code` varchar(50) NOT NULL UNIQUE,
  `department_id` int(11) NOT NULL,
  `academic_year` varchar(20) DEFAULT NULL,
  `status` enum('active','archived') DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `department_id` (`department_id`),
  KEY `status` (`status`),
  CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- STEP 5: INSERT SAMPLE SECTIONS
-- =====================================================

-- Get department IDs for foreign keys
SET @cs_dept_id = (SELECT id FROM departments WHERE department_code = 'CS' LIMIT 1);
SET @ba_dept_id = (SELECT id FROM departments WHERE department_code = 'BA' LIMIT 1);
SET @nur_dept_id = (SELECT id FROM departments WHERE department_code = 'NUR' LIMIT 1);
SET @bsit_dept_id = (SELECT id FROM departments WHERE department_code = 'BSIT' LIMIT 1);
SET @bscs_dept_id = (SELECT id FROM departments WHERE department_code = 'BSCS' LIMIT 1);
SET @bsba_dept_id = (SELECT id FROM departments WHERE department_code = 'BSBA' LIMIT 1);
SET @bsn_dept_id = (SELECT id FROM departments WHERE department_code = 'BSN' LIMIT 1);
SET @beed_dept_id = (SELECT id FROM departments WHERE department_code = 'BEED' LIMIT 1);
SET @bsed_dept_id = (SELECT id FROM departments WHERE department_code = 'BSED' LIMIT 1);

-- Insert sections for BSIT
INSERT INTO `sections` (`section_name`, `section_code`, `department_id`, `academic_year`, `status`) VALUES
('BSIT First Year Section A', 'BSIT-1A', @bsit_dept_id, '2024-2025', 'active'),
('BSIT First Year Section B', 'BSIT-1B', @bsit_dept_id, '2024-2025', 'active'),
('BSIT Second Year Section A', 'BSIT-2A', @bsit_dept_id, '2024-2025', 'active'),
('BSIT Second Year Section B', 'BSIT-2B', @bsit_dept_id, '2024-2025', 'active'),
('BSIT Third Year Section A', 'BSIT-3A', @bsit_dept_id, '2024-2025', 'active'),
('BSIT Third Year Section B', 'BSIT-3B', @bsit_dept_id, '2024-2025', 'active'),
('BSIT Fourth Year Section A', 'BSIT-4A', @bsit_dept_id, '2024-2025', 'active'),
('BSIT Fourth Year Section B', 'BSIT-4B', @bsit_dept_id, '2024-2025', 'active')
ON DUPLICATE KEY UPDATE `section_name`=`section_name`;

-- Insert sections for BSCS
INSERT INTO `sections` (`section_name`, `section_code`, `department_id`, `academic_year`, `status`) VALUES
('BSCS First Year Section A', 'BSCS-1A', @bscs_dept_id, '2024-2025', 'active'),
('BSCS First Year Section B', 'BSCS-1B', @bscs_dept_id, '2024-2025', 'active'),
('BSCS Second Year Section A', 'BSCS-2A', @bscs_dept_id, '2024-2025', 'active'),
('BSCS Second Year Section B', 'BSCS-2B', @bscs_dept_id, '2024-2025', 'active')
ON DUPLICATE KEY UPDATE `section_name`=`section_name`;

-- Insert sections for BSBA
INSERT INTO `sections` (`section_name`, `section_code`, `department_id`, `academic_year`, `status`) VALUES
('BSBA First Year Section A', 'BSBA-1A', @bsba_dept_id, '2024-2025', 'active'),
('BSBA First Year Section B', 'BSBA-1B', @bsba_dept_id, '2024-2025', 'active'),
('BSBA Second Year Section A', 'BSBA-2A', @bsba_dept_id, '2024-2025', 'active'),
('BSBA Second Year Section B', 'BSBA-2B', @bsba_dept_id, '2024-2025', 'active')
ON DUPLICATE KEY UPDATE `section_name`=`section_name`;

-- Insert sections for BSN
INSERT INTO `sections` (`section_name`, `section_code`, `department_id`, `academic_year`, `status`) VALUES
('BSN First Year Section A', 'BSN-1A', @bsn_dept_id, '2024-2025', 'active'),
('BSN First Year Section B', 'BSN-1B', @bsn_dept_id, '2024-2025', 'active'),
('BSN Second Year Section A', 'BSN-2A', @bsn_dept_id, '2024-2025', 'active'),
('BSN Second Year Section B', 'BSN-2B', @bsn_dept_id, '2024-2025', 'active')
ON DUPLICATE KEY UPDATE `section_name`=`section_name`;

-- Insert sections for BEED
INSERT INTO `sections` (`section_name`, `section_code`, `department_id`, `academic_year`, `status`) VALUES
('BEED First Year Section A', 'BEED-1A', @beed_dept_id, '2024-2025', 'active'),
('BEED First Year Section B', 'BEED-1B', @beed_dept_id, '2024-2025', 'active'),
('BEED Second Year Section A', 'BEED-2A', @beed_dept_id, '2024-2025', 'active'),
('BEED Second Year Section B', 'BEED-2B', @beed_dept_id, '2024-2025', 'active')
ON DUPLICATE KEY UPDATE `section_name`=`section_name`;

-- Insert sections for BSED
INSERT INTO `sections` (`section_name`, `section_code`, `department_id`, `academic_year`, `status`) VALUES
('BSED First Year Section A', 'BSED-1A', @bsed_dept_id, '2024-2025', 'active'),
('BSED First Year Section B', 'BSED-1B', @bsed_dept_id, '2024-2025', 'active'),
('BSED Second Year Section A', 'BSED-2A', @bsed_dept_id, '2024-2025', 'active'),
('BSED Second Year Section B', 'BSED-2B', @bsed_dept_id, '2024-2025', 'active')
ON DUPLICATE KEY UPDATE `section_name`=`section_name`;

-- =====================================================
-- STEP 6: CREATE STUDENTS TABLE
-- =====================================================

CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` varchar(50) NOT NULL UNIQUE,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL UNIQUE,
  `contact_number` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `status` enum('active','inactive','graduating','archived') DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `section_id` (`section_id`),
  KEY `status` (`status`),
  KEY `department` (`department`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- STEP 7: INSERT SAMPLE STUDENTS (Optional)
-- =====================================================

-- Get section IDs for foreign keys
SET @bsit_1a_id = (SELECT id FROM sections WHERE section_code = 'BSIT-1A' LIMIT 1);
SET @bsit_1b_id = (SELECT id FROM sections WHERE section_code = 'BSIT-1B' LIMIT 1);
SET @bsit_2a_id = (SELECT id FROM sections WHERE section_code = 'BSIT-2A' LIMIT 1);
SET @bsit_3a_id = (SELECT id FROM sections WHERE section_code = 'BSIT-3A' LIMIT 1);

-- Insert sample students (you can modify or remove this section)
INSERT INTO `students` (`student_id`, `first_name`, `middle_name`, `last_name`, `email`, `contact_number`, `address`, `department`, `section_id`, `status`) VALUES
('2024-001', 'John', 'Michael', 'Doe', 'john.doe@student.edu', '+63 912 345 6789', '123 Main Street, Quezon City', 'BSIT', @bsit_1a_id, 'active'),
('2024-002', 'Maria', 'Clara', 'Santos', 'maria.santos@student.edu', '+63 923 456 7890', '456 Oak Avenue, Manila', 'BSIT', @bsit_1b_id, 'active'),
('2024-003', 'Robert', 'James', 'Chen', 'robert.chen@student.edu', '+63 934 567 8901', '789 Pine Road, Makati', 'BSIT', @bsit_2a_id, 'active'),
('2024-004', 'Anna', 'Marie', 'Rodriguez', 'anna.rodriguez@student.edu', '+63 945 678 9012', '321 Elm Street, Pasig', 'BSBA', @bsit_1a_id, 'active'),
('2024-005', 'Michael', 'Anthony', 'Garcia', 'michael.garcia@student.edu', '+63 956 789 0123', '654 Maple Drive, Taguig', 'BSIT', @bsit_3a_id, 'graduating')
ON DUPLICATE KEY UPDATE `first_name`=`first_name`;

-- =====================================================
-- VERIFICATION QUERIES (Optional - uncomment to run)
-- =====================================================

-- Check if all tables were created
-- SELECT 'departments' as table_name, COUNT(*) as record_count FROM departments
-- UNION ALL
-- SELECT 'sections', COUNT(*) FROM sections
-- UNION ALL
-- SELECT 'students', COUNT(*) FROM students;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- All three tables (departments, sections, students) have been created
-- with proper foreign key relationships and sample data.
-- =====================================================
