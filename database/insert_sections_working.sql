-- Working INSERT query using INSERT...SELECT method
-- This method is more reliable and works in all MySQL versions

INSERT INTO `sections` (`section_name`, `section_code`, `department_id`, `academic_year`, `status`)
SELECT 'Section A', 'CS-SEC-A', id, '2024-2025', 'active' FROM departments WHERE department_code = 'CS'
UNION ALL
SELECT 'Section B', 'CS-SEC-B', id, '2024-2025', 'active' FROM departments WHERE department_code = 'CS'
UNION ALL
SELECT 'Section C', 'CS-SEC-C', id, '2023-2024', 'active' FROM departments WHERE department_code = 'CS'
UNION ALL
SELECT 'Section A', 'BA-SEC-A', id, '2024-2025', 'active' FROM departments WHERE department_code = 'BA'
UNION ALL
SELECT 'Section B', 'BA-SEC-B', id, '2024-2025', 'active' FROM departments WHERE department_code = 'BA'
UNION ALL
SELECT 'Section A', 'NUR-SEC-A', id, '2024-2025', 'active' FROM departments WHERE department_code = 'NUR'
UNION ALL
SELECT 'Section B', 'NUR-SEC-B', id, '2024-2025', 'active' FROM departments WHERE department_code = 'NUR'
UNION ALL
SELECT 'Section A', 'BSIS-SEC-A', id, '2024-2025', 'active' FROM departments WHERE department_code = 'BSIS'
UNION ALL
SELECT 'Section A', 'WFT-SEC-A', id, '2024-2025', 'active' FROM departments WHERE department_code = 'WFT'
UNION ALL
SELECT 'Section A', 'BTVTEd-SEC-A', id, '2024-2025', 'active' FROM departments WHERE department_code = 'BTVTEd'
ON DUPLICATE KEY UPDATE `section_name`=`section_name`;

