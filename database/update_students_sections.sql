-- Update students with section IDs after sections are created
-- Run this AFTER insert_sections_working.sql has been executed

-- Computer Science students
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'CS-SEC-A' LIMIT 1) WHERE student_id = '2024-001';
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'CS-SEC-A' LIMIT 1) WHERE student_id = '2024-002';
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'CS-SEC-B' LIMIT 1) WHERE student_id = '2024-003';
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'CS-SEC-B' LIMIT 1) WHERE student_id = '2024-015';

-- Business Administration students
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'BA-SEC-A' LIMIT 1) WHERE student_id = '2024-004';
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'BA-SEC-A' LIMIT 1) WHERE student_id = '2024-005';
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'BA-SEC-B' LIMIT 1) WHERE student_id = '2024-006';
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'BA-SEC-B' LIMIT 1) WHERE student_id = '2024-016';

-- Nursing students
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'NUR-SEC-A' LIMIT 1) WHERE student_id = '2024-007';
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'NUR-SEC-A' LIMIT 1) WHERE student_id = '2024-008';
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'NUR-SEC-B' LIMIT 1) WHERE student_id = '2024-009';
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'NUR-SEC-B' LIMIT 1) WHERE student_id = '2024-017';

-- BSIS students
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'BSIS-SEC-A' LIMIT 1) WHERE student_id = '2024-010';
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'BSIS-SEC-A' LIMIT 1) WHERE student_id = '2024-011';
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'BSIS-SEC-A' LIMIT 1) WHERE student_id = '2024-018';

-- WFT students
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'WFT-SEC-A' LIMIT 1) WHERE student_id = '2024-012';
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'WFT-SEC-A' LIMIT 1) WHERE student_id = '2024-013';
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'WFT-SEC-A' LIMIT 1) WHERE student_id = '2024-019';

-- BTVTEd students
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'BTVTEd-SEC-A' LIMIT 1) WHERE student_id = '2024-014';
UPDATE students SET section_id = (SELECT id FROM sections WHERE section_code = 'BTVTEd-SEC-A' LIMIT 1) WHERE student_id = '2024-020';

