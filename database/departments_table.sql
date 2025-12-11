-- Create departments table
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

-- Insert sample departments
INSERT INTO `departments` (`department_name`, `department_code`, `status`) VALUES
('Computer Science', 'CS', 'active'),
('Business Administration', 'BA', 'active'),
('Nursing', 'NUR', 'active'),
('Bachelor of Science in Information System', 'BSIS', 'active'),
('Welding and Fabrication Technology', 'WFT', 'active'),
('Bachelor of Technical-Vocational Education and Training', 'BTVTEd', 'active')
ON DUPLICATE KEY UPDATE `department_name`=`department_name`;

