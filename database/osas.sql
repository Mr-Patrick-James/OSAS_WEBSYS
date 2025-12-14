-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 14, 2025 at 04:11 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `osas`
--

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `head_of_department` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('active','archived') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `department_code` (`department_code`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `department_name`, `department_code`, `head_of_department`, `description`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Computer Science', 'CS', NULL, NULL, 'active', '2025-12-14 09:38:55', NULL),
(2, 'Business Administration', 'BA', NULL, NULL, 'active', '2025-12-14 09:38:55', NULL),
(3, 'Nursing', 'NUR', NULL, NULL, 'active', '2025-12-14 09:38:55', NULL),
(4, 'Bachelor of Science in Information System', 'BSIS', NULL, NULL, 'active', '2025-12-14 09:38:55', NULL),
(5, 'Welding and Fabrication Technology', 'WFT', NULL, NULL, 'active', '2025-12-14 09:38:55', NULL),
(6, 'Bachelor of Technical-Vocational Education and Training', 'BTVTEd', NULL, NULL, 'active', '2025-12-14 09:38:55', NULL),
(7, 'BS Information Technology', 'BSIT', NULL, NULL, 'active', '2025-12-14 09:38:55', NULL),
(8, 'BS Computer Science', 'BSCS', NULL, NULL, 'active', '2025-12-14 09:38:55', NULL),
(9, 'BS Business Administration', 'BSBA', NULL, NULL, 'active', '2025-12-14 09:38:55', NULL),
(10, 'BS Nursing', 'BSN', NULL, NULL, 'active', '2025-12-14 09:38:55', NULL),
(11, 'Bachelor of Elementary Education', 'BEED', NULL, NULL, 'active', '2025-12-14 09:38:55', NULL),
(12, 'Bachelor of Secondary Education', 'BSED', NULL, NULL, 'active', '2025-12-14 09:38:55', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

DROP TABLE IF EXISTS `sections`;
CREATE TABLE IF NOT EXISTS `sections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `section_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `section_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_id` int NOT NULL,
  `academic_year` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','archived') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `section_code` (`section_code`),
  KEY `department_id` (`department_id`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`id`, `section_name`, `section_code`, `department_id`, `academic_year`, `status`, `created_at`, `updated_at`) VALUES
(1, 'BSIT First Year Section A', 'BSIT-1A', 7, '2024-2025', 'active', '2025-12-14 09:38:55', NULL),
(2, 'BSIT First Year Section B', 'BSIT-1B', 7, '2024-2025', 'active', '2025-12-14 09:38:55', NULL),
(3, 'BSIT Second Year Section A', 'BSIT-2A', 7, '2024-2025', 'active', '2025-12-14 09:38:55', NULL),
(4, 'BSIT Second Year Section B', 'BSIT-2B', 7, '2024-2025', 'active', '2025-12-14 09:38:55', NULL),
(5, 'BSIT Third Year Section A', 'BSIT-3A', 7, '2024-2025', 'active', '2025-12-14 09:38:55', NULL),
(6, 'BSIT Third Year Section B', 'BSIT-3B', 7, '2024-2025', 'active', '2025-12-14 09:38:55', NULL),
(7, 'BSIT Fourth Year Section A', 'BSIT-4A', 7, '2024-2025', 'active', '2025-12-14 09:38:55', NULL),
(8, 'BSIT Fourth Year Section B', 'BSIT-4B', 7, '2024-2025', 'active', '2025-12-14 09:38:55', NULL),
(9, 'BSCS First Year Section A', 'BSCS-1A', 8, '2024-2025', 'active', '2025-12-14 09:38:55', NULL),
(10, 'BSCS First Year Section B', 'BSCS-1B', 8, '2024-2025', 'active', '2025-12-14 09:38:55', NULL),
(11, 'BSCS Second Year Section A', 'BSCS-2A', 8, '2024-2025', 'active', '2025-12-14 09:38:55', NULL),
(12, 'BSCS Second Year Section B', 'BSCS-2B', 8, '2024-2025', 'active', '2025-12-14 09:38:55', NULL),
(13, 'BSBA First Year Section A', 'BSBA-1A', 9, '2024-2025', 'active', '2025-12-14 09:38:56', NULL),
(14, 'BSBA First Year Section B', 'BSBA-1B', 9, '2024-2025', 'active', '2025-12-14 09:38:56', NULL),
(15, 'BSBA Second Year Section A', 'BSBA-2A', 9, '2024-2025', 'active', '2025-12-14 09:38:56', NULL),
(16, 'BSBA Second Year Section B', 'BSBA-2B', 9, '2024-2025', 'active', '2025-12-14 09:38:56', NULL),
(17, 'BSN First Year Section A', 'BSN-1A', 10, '2024-2025', 'active', '2025-12-14 09:38:56', NULL),
(18, 'BSN First Year Section B', 'BSN-1B', 10, '2024-2025', 'active', '2025-12-14 09:38:56', NULL),
(19, 'BSN Second Year Section A', 'BSN-2A', 10, '2024-2025', 'active', '2025-12-14 09:38:56', NULL),
(20, 'BSN Second Year Section B', 'BSN-2B', 10, '2024-2025', 'active', '2025-12-14 09:38:56', NULL),
(21, 'BEED First Year Section A', 'BEED-1A', 11, '2024-2025', 'active', '2025-12-14 09:38:56', NULL),
(22, 'BEED First Year Section B', 'BEED-1B', 11, '2024-2025', 'active', '2025-12-14 09:38:56', NULL),
(23, 'BEED Second Year Section A', 'BEED-2A', 11, '2024-2025', 'active', '2025-12-14 09:38:56', NULL),
(24, 'BEED Second Year Section B', 'BEED-2B', 11, '2024-2025', 'active', '2025-12-14 09:38:56', NULL),
(25, 'BSED First Year Section A', 'BSED-1A', 12, '2024-2025', 'active', '2025-12-14 09:38:56', NULL),
(26, 'BSED First Year Section B', 'BSED-1B', 12, '2024-2025', 'active', '2025-12-14 09:38:56', NULL),
(27, 'BSED Second Year Section A', 'BSED-2A', 12, '2024-2025', 'active', '2025-12-14 09:38:56', NULL),
(28, 'BSED Second Year Section B', 'BSED-2B', 12, '2024-2025', 'active', '2025-12-14 09:38:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `middle_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `department` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `section_id` int DEFAULT NULL,
  `avatar` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('active','inactive','graduating','archived') COLLATE utf8mb4_unicode_ci DEFAULT 'active',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`),
  UNIQUE KEY `email` (`email`),
  KEY `section_id` (`section_id`),
  KEY `status` (`status`),
  KEY `department` (`department`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `student_id`, `first_name`, `middle_name`, `last_name`, `email`, `contact_number`, `address`, `department`, `section_id`, `avatar`, `status`, `created_at`, `updated_at`) VALUES
(1, '2024-001', 'John', 'Michael', 'Doe', 'john.doe@student.edu', '+63 912 345 6789', '123 Main Street, Quezon City', 'BSIT', 1, NULL, 'active', '2025-12-14 09:38:56', NULL),
(2, '2024-002', 'Maria', 'Clara', 'Santos', 'maria.santos@student.edu', '+63 923 456 7890', '456 Oak Avenue, Manila', 'BSIT', 2, NULL, 'active', '2025-12-14 09:38:56', NULL),
(3, '2024-003', 'Robert', 'James', 'Chen', 'robert.chen@student.edu', '+63 934 567 8901', '789 Pine Road, Makati', 'BSIT', 3, NULL, 'active', '2025-12-14 09:38:56', NULL),
(4, '2024-004', 'Anna', 'Marie', 'Rodriguez', 'anna.rodriguez@student.edu', '+63 945 678 9012', '321 Elm Street, Pasig', 'BSBA', 1, NULL, 'active', '2025-12-14 09:38:56', NULL),
(5, '2024-005', 'Michael', 'Anthony', 'Garcia', 'michael.garcia@student.edu', '+63 956 789 0123', '654 Maple Drive, Taguig', 'BSIT', 5, NULL, 'graduating', '2025-12-14 09:38:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `full_name` varchar(100) NOT NULL,
  `student_id` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `full_name`, `student_id`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@osas.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'System Administrator', NULL, 1, '2025-10-14 02:46:08', '2025-10-14 02:46:08'),
(2, 'osas_admin', 'osas@admin.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'OSAS Admin', NULL, 1, '2025-10-14 02:46:08', '2025-10-14 02:46:08'),
(3, 'student', 'student@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'John Doe', '2024-001', 1, '2025-10-14 02:46:08', '2025-10-14 02:46:08'),
(4, 'test_student', 'test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'Jane Smith', '2024-002', 1, '2025-10-14 02:46:08', '2025-10-14 02:46:08'),
(5, 'jumyr', 'morenojumyr0@gmail.com', '$2y$10$166a7LG0mS7E.HOwr2wqhuuF.PkU8LcVCa3tRuhIZsY7YKqfk3Hau', 'admin', 'Jumyr Moreno', '2024n2020', 1, '2025-10-14 03:21:09', '2025-12-14 03:14:47');

-- --------------------------------------------------------

--
-- Table structure for table `violations`
--

DROP TABLE IF EXISTS `violations`;
CREATE TABLE IF NOT EXISTS `violations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `case_id` varchar(20) NOT NULL,
  `student_id` varchar(20) NOT NULL,
  `violation_type` enum('improper_uniform','no_id','improper_footwear','misconduct') NOT NULL,
  `violation_level` enum('permitted1','permitted2','warning1','warning2','warning3','disciplinary') NOT NULL,
  `department` enum('BSIS','WFT','BTVTED','CHS') NOT NULL,
  `section` varchar(20) NOT NULL,
  `violation_date` date NOT NULL,
  `violation_time` time NOT NULL,
  `location` enum('gate_1','gate_2','classroom','library','cafeteria','gym','others') NOT NULL,
  `reported_by` varchar(100) NOT NULL,
  `notes` text,
  `status` enum('permitted','warning','disciplinary','resolved') NOT NULL DEFAULT 'warning',
  `attachments` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `case_id` (`case_id`),
  KEY `idx_case_id` (`case_id`),
  KEY `idx_student_id` (`student_id`),
  KEY `idx_department` (`department`),
  KEY `idx_status` (`status`),
  KEY `idx_violation_date` (`violation_date`),
  KEY `idx_violation_type` (`violation_type`),
  KEY `idx_violation_level` (`violation_level`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `violations`
--

INSERT INTO `violations` (`id`, `case_id`, `student_id`, `violation_type`, `violation_level`, `department`, `section`, `violation_date`, `violation_time`, `location`, `reported_by`, `notes`, `status`, `attachments`, `created_at`, `updated_at`) VALUES
(1, 'VIOL-2024-001', '2024-001', 'improper_uniform', 'warning2', '', 'BSIT-3A', '2024-02-15', '08:15:00', 'gate_1', 'Officer Maria Santos', 'Student was found wearing improper uniform - wearing colored undershirt instead of the required white undershirt. This is the second offense for improper uniform violation.', 'warning', NULL, '2025-12-14 01:38:56', '2025-12-14 01:38:56'),
(2, 'VIOL-2024-002', '2024-002', 'no_id', 'permitted1', '', 'BSIT-1B', '2024-02-14', '07:30:00', 'gate_2', 'Officer Juan Dela Cruz', 'Student forgot to bring ID. First offense.', 'permitted', NULL, '2025-12-14 01:38:56', '2025-12-14 01:38:56'),
(3, 'VIOL-2024-003', '2024-003', 'improper_footwear', 'disciplinary', '', 'BSIT-2A', '2024-02-10', '08:30:00', 'classroom', 'Professor Ana Reyes', 'Student was wearing sneakers instead of the required black leather shoes in violation of school uniform policy.', 'disciplinary', NULL, '2025-12-14 01:38:56', '2025-12-14 01:38:56'),
(4, 'VIOL-2024-004', '2024-004', 'improper_uniform', 'warning3', '', 'BSIT-1A', '2024-02-08', '09:15:00', 'library', 'Librarian Pedro Gomez', 'Third warning for improper uniform. Student has been repeatedly reminded about the uniform policy.', 'resolved', NULL, '2025-12-14 01:38:56', '2025-12-14 01:38:56');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sections`
--
ALTER TABLE `sections`
  ADD CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
