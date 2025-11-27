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
    
    // Get attendance data from mark_attendance table
    $sql = "SELECT ma.student_id, s.last_name, s.first_name, ma.session_id, ma.status, ma.participation
            FROM mark_attendance ma
            JOIN students s ON ma.student_id = s.id
            WHERE ma.course_id = ? AND ma.group_name = ?
            ORDER BY ma.student_id, ma.session_id";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$course, $group]);
    $attendanceRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Organize data by student
    $students = [];
    foreach ($attendanceRecords as $record) {
        $studentId = $record['student_id'];
        
        if (!isset($students[$studentId])) {
            $students[$studentId] = [
                'student_id' => $studentId,
                'last_name' => $record['last_name'],
                'first_name' => $record['first_name'],
                'sessions' => []
            ];
        }
        
        // Add session data
        $students[$studentId]['sessions'][$record['session_id']] = [
            'status' => $record['status'],
            'participation' => $record['participation']
        ];
    }
    
    echo json_encode(array_values($students));
    
} catch(PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>