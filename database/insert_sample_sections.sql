-- Insert 10 sample sections connected to departments
-- Run this query in phpMyAdmin or MySQL command line

INSERT INTO `sections` (`section_name`, `section_code`, `department_id`, `academic_year`, `status`) VALUES
-- Computer Science sections (3)
('Section A', 'CS-SEC-A', (SELECT id FROM departments WHERE department_code = 'CS' LIMIT 1), '2024-2025', 'active'),
('Section B', 'CS-SEC-B', (SELECT id FROM departments WHERE department_code = 'CS' LIMIT 1), '2024-2025', 'active'),
('Section C', 'CS-SEC-C', (SELECT id FROM departments WHERE department_code = 'CS' LIMIT 1), '2023-2024', 'active'),
-- Business Administration sections (2)
('Section A', 'BA-SEC-A', (SELECT id FROM departments WHERE department_code = 'BA' LIMIT 1), '2024-2025', 'active'),
('Section B', 'BA-SEC-B', (SELECT id FROM departments WHERE department_code = 'BA' LIMIT 1), '2024-2025', 'active'),
-- Nursing sections (2)
('Section A', 'NUR-SEC-A', (SELECT id FROM departments WHERE department_code = 'NUR' LIMIT 1), '2024-2025', 'active'),
('Section B', 'NUR-SEC-B', (SELECT id FROM departments WHERE department_code = 'NUR' LIMIT 1), '2024-2025', 'active'),
-- BSIS section (1)
('Section A', 'BSIS-SEC-A', (SELECT id FROM departments WHERE department_code = 'BSIS' LIMIT 1), '2024-2025', 'active'),
-- WFT section (1)
('Section A', 'WFT-SEC-A', (SELECT id FROM departments WHERE department_code = 'WFT' LIMIT 1), '2024-2025', 'active'),
-- BTVTEd section (1)
('Section A', 'BTVTEd-SEC-A', (SELECT id FROM departments WHERE department_code = 'BTVTEd' LIMIT 1), '2024-2025', 'active')
ON DUPLICATE KEY UPDATE `section_name`=`section_name`;
