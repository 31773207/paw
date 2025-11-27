<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Turn on error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'localhost';
$dbname = 'attendflow_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $course = $_GET['course'] ?? 'WEB101';
    $group = $_GET['group'] ?? 'Group 01';
    
    // Get all students for this course and group
    $studentsSql = "SELECT DISTINCT s.id as student_id, s.last_name, s.first_name 
                    FROM students s 
                    JOIN enrollment e ON s.id = e.student_id 
                    WHERE e.course_id = ? AND e.student_group = ? 
                    ORDER BY s.id";
    
    $studentsStmt = $pdo->prepare($studentsSql);
    $studentsStmt->execute([$course, $group]);
    $students = $studentsStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Get attendance data for these students
    $attendanceSql = "SELECT student_id, session_id, status, participation 
                      FROM mark_attendance 
                      WHERE course_id = ? AND group_name = ? 
                      ORDER BY student_id, session_id";
    
    $attendanceStmt = $pdo->prepare($attendanceSql);
    $attendanceStmt->execute([$course, $group]);
    $attendanceRecords = $attendanceStmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Organize attendance data by student and session
    $attendanceByStudent = [];
    foreach ($attendanceRecords as $record) {
        $studentId = $record['student_id'];
        if (!isset($attendanceByStudent[$studentId])) {
            $attendanceByStudent[$studentId] = ['sessions' => []];
        }
        $attendanceByStudent[$studentId]['sessions'][$record['session_id']] = [
            'status' => $record['status'],
            'participation' => $record['participation']
        ];
    }
    
    // Combine student data with attendance data
    $result = [];
    foreach ($students as $student) {
        $studentId = $student['student_id'];
        $result[] = [
            'student_id' => $studentId,
            'last_name' => $student['last_name'],
            'first_name' => $student['first_name'],
            'sessions' => $attendanceByStudent[$studentId]['sessions'] ?? []
        ];
    }
    
    echo json_encode($result);
    
} catch(PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>