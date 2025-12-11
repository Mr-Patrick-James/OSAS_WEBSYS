-- Complete database setup for Sections feature
-- Run this file to set up both departments and sections tables

-- Step 1: Create departments table
CREATE TABLE IF NOT EXISTS `departments` (
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

-- Step 2: Insert sample departments (only if table is empty)
INSERT INTO `departments` (`department_name`, `department_code`, `status`) 
SELECT * FROM (
  SELECT 'Computer Science' as dept_name, 'CS' as dept_code, 'active' as dept_status
  UNION ALL SELECT 'Business Administration', 'BA', 'active'
  UNION ALL SELECT 'Nursing', 'NUR', 'active'
  UNION ALL SELECT 'Bachelor of Science in Information System', 'BSIS', 'active'
  UNION ALL SELECT 'Welding and Fabrication Technology', 'WFT', 'active'
  UNION ALL SELECT 'Bachelor of Technical-Vocational Education and Training', 'BTVTEd', 'active'
) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM `departments` WHERE `department_code` = tmp.dept_code);

-- Step 3: Create sections table
CREATE TABLE IF NOT EXISTS `sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `section_name` varchar(255) NOT NULL,
  `section_code` varchar(50) NOT NULL UNIQUE,
  `department_id` int(11) DEFAULT NULL,
  `academic_year` varchar(20) NOT NULL,
  `status` enum('active','archived') DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `department_id` (`department_id`),
  KEY `status` (`status`),
  CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

