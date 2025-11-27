<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$host = 'localhost';
$dbname = 'attendflow_db';
$username = 'root';
$password = '';

$input = json_decode(file_get_contents('php://input'), true);

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    
    $course = $input['course'];
    $attendanceData = $input['attendance'];
    $group = 'Group 01'; // You can get this from input if needed
    
    $pdo->beginTransaction();
    
    // Use your actual column names: session_id and group_name
    $sql = "INSERT INTO mark_attendance (student_id, course_id, group_name, session_id, status, participation) 
            VALUES (?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            status = VALUES(status), participation = VALUES(participation)";
    
    $stmt = $pdo->prepare($sql);
    
    foreach ($attendanceData as $record) {
        $stmt->execute([
            $record['student_id'],
            $course,
            $group, // Using the group variable
            $record['session'], // This maps to session_id in your table
            $record['status'],
            $record['participation']
        ]);
    }
    
    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Attendance saved successfully']);
    
} catch(PDOException $e) {
    if (isset($pdo)) $pdo->rollBack();
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>