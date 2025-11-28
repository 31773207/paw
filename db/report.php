/*//<?php
// Database configuration
$host = 'localhost';
$dbname = 'attendflow_db';
$username = 'root';
$password = '';

// Get parameters or use defaults
$course = isset($_GET['course']) ? $_GET['course'] : 'WEB101';
$group = isset($_GET['group']) ? $_GET['group'] : 'Group 01';

// Initialize variables
$totalStudents = 0;
$studentsPresent = 0;
$studentsParticipated = 0;
$studentsExcluded = 0;

try {
    // Connect to MySQL database
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 1. Get students for this course and group
    $sql = "SELECT s.id, s.first_name, s.last_name 
            FROM students s
            JOIN enrollment e ON s.id = e.student_id
            WHERE e.course_id = ? AND e.student_group = ?
            ORDER BY s.last_name, s.first_name";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$course, $group]);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $totalStudents = count($students);
    
    if (!empty($students)) {
        $studentIds = array_column($students, 'id');
        
        // 2. Get attendance data from mark_attendance table (THE CORRECT TABLE!)
        $placeholders = str_repeat('?,', count($studentIds) - 1) . '?';
        $sql = "SELECT student_id, session_id, status 
                FROM mark_attendance 
                WHERE course_id = ? AND group_name = ? AND student_id IN ($placeholders)";
        
        $stmt = $pdo->prepare($sql);
        $params = array_merge([$course, $group], $studentIds);
        $stmt->execute($params);
        $attendanceData = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // 3. Count present sessions per student
        $presentCount = [];
        foreach ($attendanceData as $record) {
            $studentId = $record['student_id'];
            if (!isset($presentCount[$studentId])) {
                $presentCount[$studentId] = 0;
            }
            // Count only 'present' status
            if ($record['status'] === 'present') {
                $presentCount[$studentId]++;
            }
        }
        
        // 4. Calculate statistics
        foreach ($students as $student) {
            $studentId = $student['id'];
            $presentSessions = $presentCount[$studentId] ?? 0;
            
            if ($presentSessions > 0) $studentsPresent++;
            if ($presentSessions >= 3) $studentsParticipated++;
            if ($presentSessions <= 2) $studentsExcluded++;
        }
    }
    
} catch(PDOException $e) {
    // Keep zeros if there's an error
    $totalStudents = 0;
    $studentsPresent = 0;
    $studentsParticipated = 0;
    $studentsExcluded = 0;
}
?>
*/