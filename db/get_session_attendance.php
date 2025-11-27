<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$dbname = 'attendflow_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $course = $_GET['course'] ?? 'WEB101';
    $group = $_GET['group'] ?? 'Group 01';
    
    // Get attendance data for this specific session
    $sql = "SELECT student_id, session_id, status, participation 
            FROM mark_attendance 
            WHERE course_id = ? AND group_name = ?";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$course, $group]);
    $attendanceData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($attendanceData);
    
} catch(PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>