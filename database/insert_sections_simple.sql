-- Alternative: Simple INSERT query using direct department IDs
-- First, run this to see your department IDs:
-- SELECT id, department_code, department_name FROM departments;

-- Then replace the numbers below with your actual department IDs
-- Example: If CS has id=1, BA has id=2, etc.

INSERT INTO `sections` (`section_name`, `section_code`, `department_id`, `academic_year`, `status`) VALUES
-- Computer Science sections (3) - Replace 1 with actual CS department ID
('Section A', 'CS-SEC-A', 1, '2024-2025', 'active'),
('Section B', 'CS-SEC-B', 1, '2024-2025', 'active'),
('Section C', 'CS-SEC-C', 1, '2023-2024', 'active'),
-- Business Administration sections (2) - Replace 2 with actual BA department ID
('Section A', 'BA-SEC-A', 2, '2024-2025', 'active'),
('Section B', 'BA-SEC-B', 2, '2024-2025', 'active'),
-- Nursing sections (2) - Replace 3 with actual NUR department ID
('Section A', 'NUR-SEC-A', 3, '2024-2025', 'active'),
('Section B', 'NUR-SEC-B', 3, '2024-2025', 'active'),
-- BSIS section (1) - Replace 4 with actual BSIS department ID
('Section A', 'BSIS-SEC-A', 4, '2024-2025', 'active'),
-- WFT section (1) - Replace 5 with actual WFT department ID
('Section A', 'WFT-SEC-A', 5, '2024-2025', 'active'),
-- BTVTEd section (1) - Replace 6 with actual BTVTEd department ID
('Section A', 'BTVTEd-SEC-A', 6, '2024-2025', 'active')
ON DUPLICATE KEY UPDATE `section_name`=`section_name`;

