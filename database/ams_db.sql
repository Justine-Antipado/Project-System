-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 24, 2026 at 06:13 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ams_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE DATABASE ams_db;

USE ams_db;

CREATE TABLE `events` (
  `EventID` int(11) NOT NULL,
  `EventName` varchar(200) NOT NULL,
  `Date` date NOT NULL,
  `Venue` varchar(200) DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `Program` varchar(10) NOT NULL DEFAULT 'BSIT',
  `SemesterID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`EventID`, `EventName`, `Date`, `Venue`, `Status`, `Program`, `SemesterID`) VALUES
(1, 'Assembly', '2026-05-08', 'OMSC Gymnasium', 'Completed', 'BSIT', 5),
(2, 'Assembly', '2026-08-01', 'OMSC Gymnasium', 'Ongoing', 'BSIT', 5),
(4, 'Assembly', '2026-08-01', 'OMSC Gymnasium', 'Ongoing', 'BSIT', 5),
(6, 'Assembly', '2026-08-01', 'OMSC Gymnasium', 'Ongoing', 'BSCS', 5),
(7, 'IT Day', '2025-12-10', 'OMSC Gymnasium', 'Completed', 'BSCS', 5),
(9, 'Assembly', '2026-08-01', 'OMSC Gymnasium', 'Ongoing', 'BSCS', 5),
(10, 'Meeting', '2025-01-02', 'OMSC Gymnasium', 'Completed', 'BSIS', 6),
(11, 'IT Day', '2025-12-10', 'OMSC Gymnasium', 'Completed', 'BSIS', 7),
(12, 'Meeting', '2026-01-06', 'OMSC Gymnasium', 'Cancelled', 'BSIS', 8),
(13, 'Acquaintance Party', '2026-06-15', 'OMSC Gymnasium', 'Ongoing', 'BSIS', 5);

-- --------------------------------------------------------

--
-- Table structure for table `event_attendance`
--

CREATE TABLE `event_attendance` (
  `EventAttendanceID` int(11) NOT NULL,
  `EventID` int(11) DEFAULT NULL,
  `StudentID` int(11) DEFAULT NULL,
  `ScannedBy` int(11) DEFAULT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `officers`
--

CREATE TABLE `officers` (
  `OfficersID` int(11) NOT NULL,
  `StudentID` int(11) DEFAULT NULL,
  `OrgID` int(11) DEFAULT NULL,
  `Position` varchar(100) DEFAULT NULL,
  `TermYear` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `officers`
--

INSERT INTO `officers` (`OfficersID`, `StudentID`, `OrgID`, `Position`, `TermYear`) VALUES
(57, 107, 5, 'Vice President', '2025-2026'),
(58, 108, 3, 'Vice Mayor', '2024-2025'),
(59, 110, 5, 'Vice President', '2025-2026');

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `OrgID` int(11) NOT NULL,
  `OrgName` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`OrgID`, `OrgName`) VALUES
(3, 'CBAM'),
(5, 'Club'),
(6, 'kalbo'),
(7, 'kupal'),
(1, 'PADC'),
(4, 'SSG'),
(2, 'YMO');

-- --------------------------------------------------------

--
-- Table structure for table `school_years`
--

CREATE TABLE `school_years` (
  `YearID` int(11) NOT NULL,
  `YearRange` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `school_years`
--

INSERT INTO `school_years` (`YearID`, `YearRange`) VALUES
(3, '2026-2027'),
(4, '2027-2028');

-- --------------------------------------------------------

--
-- Table structure for table `semesters`
--

CREATE TABLE `semesters` (
  `SemesterID` int(11) NOT NULL,
  `YearID` int(11) DEFAULT NULL,
  `SemesterName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `semesters`
--

INSERT INTO `semesters` (`SemesterID`, `YearID`, `SemesterName`) VALUES
(5, 3, '1st Semester'),
(6, 3, '2nd Semester'),
(7, 4, '1st Semester'),
(8, 4, '2nd Semester');

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

CREATE TABLE `students` (
  `StudentID` int(11) NOT NULL,
  `SchoolIDNo` varchar(50) NOT NULL,
  `Email` varchar(150) DEFAULT NULL,
  `LastName` varchar(100) NOT NULL,
  `FirstName` varchar(100) NOT NULL,
  `MiddleName` varchar(100) DEFAULT NULL,
  `Program` varchar(100) DEFAULT NULL,
  `YearLevel` int(11) DEFAULT NULL,
  `section` varchar(11) DEFAULT NULL,
  `StudentQRCode` text DEFAULT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`StudentID`, `SchoolIDNo`, `Email`, `LastName`, `FirstName`, `MiddleName`, `Program`, `YearLevel`, `section`, `StudentQRCode`, `Password`) VALUES
(19, '2024-1-0464', 'ranjetaynmfdf@gmail.com', 'Mulingbayan', 'Ranjet', 'Ayn', 'BSHM', 3, 'B', 'OMSC-2024-1-0464-821c83d1', '$2y$10$fK2LODt23VKuXhOhkNDgN.xuVKmm.3mzbyhrGcjMBUrsoZgBIAe82'),
(107, '2024', 'justineantipado10@gmail.com', 'Antipado', 'Justine', 'Magpantay', 'BSCS', 3, 'E', 'OMSC-2024-8dfee9d0', '$2y$10$mPtRzaGutu/l.dep6PVZmOLxqYvVCiLIpZFVnDqNGHljavZpQoOXu'),
(108, '2024-1', 'justineantipado010@gmail.com', 'Mulingbayan', 'Ranjet', '', 'BSIT', 1, 'B', 'OMSC-2024-1-70c9870e', '$2y$10$YNRDQQh10Up1dRlRH00ln.9b/ffh4t48I8PfJ92oNDIrMGvTPdH3u'),
(109, '20248', 'justineantipado100@gmail.com', 'Antipado', 'ian', 'Magpantay', 'BSCS', 2, 'B', 'OMSC-20248-33a2cce7', '$2y$10$CTU.XVHstcqMCPTrL8GiNevOaqCAwPWjOMh1LpMdIKfXTt4Q5mgx6'),
(110, '20244', 'ranjetaynm@gmail.com', 'Mulingbayan', 'Ranjet', 'Ayn', 'BSCS', 2, 'C', 'OMSC-20244-b6c8971a', '$2y$10$vMnxuVjlJAgRBhnsG/Que.tmgXOTiC2BgH7JgTVXcMvcuVcnGhVR2');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`EventID`),
  ADD KEY `SemesterID` (`SemesterID`);

--
-- Indexes for table `event_attendance`
--
ALTER TABLE `event_attendance`
  ADD PRIMARY KEY (`EventAttendanceID`),
  ADD UNIQUE KEY `unique_scan` (`EventID`,`StudentID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `ScannedBy` (`ScannedBy`);

--
-- Indexes for table `officers`
--
ALTER TABLE `officers`
  ADD PRIMARY KEY (`OfficersID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `OrgID` (`OrgID`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`OrgID`),
  ADD UNIQUE KEY `OrgName` (`OrgName`);

--
-- Indexes for table `school_years`
--
ALTER TABLE `school_years`
  ADD PRIMARY KEY (`YearID`),
  ADD UNIQUE KEY `YearRange` (`YearRange`);

--
-- Indexes for table `semesters`
--
ALTER TABLE `semesters`
  ADD PRIMARY KEY (`SemesterID`),
  ADD KEY `YearID` (`YearID`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`StudentID`),
  ADD UNIQUE KEY `SchoolIDNo` (`SchoolIDNo`),
  ADD UNIQUE KEY `SchoolIDNo_2` (`SchoolIDNo`),
  ADD UNIQUE KEY `unique_school_id` (`SchoolIDNo`),
  ADD UNIQUE KEY `Email` (`Email`),
  ADD UNIQUE KEY `Email_2` (`Email`),
  ADD UNIQUE KEY `unique_email` (`Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `EventID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `event_attendance`
--
ALTER TABLE `event_attendance`
  MODIFY `EventAttendanceID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `officers`
--
ALTER TABLE `officers`
  MODIFY `OfficersID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `OrgID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `school_years`
--
ALTER TABLE `school_years`
  MODIFY `YearID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `semesters`
--
ALTER TABLE `semesters`
  MODIFY `SemesterID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `StudentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`SemesterID`) REFERENCES `semesters` (`SemesterID`) ON DELETE CASCADE;

--
-- Constraints for table `event_attendance`
--
ALTER TABLE `event_attendance`
  ADD CONSTRAINT `event_attendance_ibfk_1` FOREIGN KEY (`EventID`) REFERENCES `events` (`EventID`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_attendance_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_attendance_ibfk_3` FOREIGN KEY (`ScannedBy`) REFERENCES `officers` (`OfficersID`) ON DELETE SET NULL;

--
-- Constraints for table `officers`
--
ALTER TABLE `officers`
  ADD CONSTRAINT `officers_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `students` (`StudentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `officers_ibfk_2` FOREIGN KEY (`OrgID`) REFERENCES `organizations` (`OrgID`) ON DELETE CASCADE;

--
-- Constraints for table `semesters`
--
ALTER TABLE `semesters`
  ADD CONSTRAINT `semesters_ibfk_1` FOREIGN KEY (`YearID`) REFERENCES `school_years` (`YearID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
