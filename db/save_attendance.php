<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$host = 'localhost';
$dbname = 'attendflow_db';
$username = 'root';
$password = '';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'error' => 'No data received']);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $course = $input['course'] ?? 'webdev';
    $attendanceData = $input['attendance'] ?? [];
    
    $pdo->beginTransaction();
    
    $count = 0;
    foreach ($attendanceData as $record) {
        $student_id = $record['student_id'];
        $session_id = $record['session'];
        $status = $record['status'];
        $participation = $record['participation'] ?? 0;
        
        // Use INSERT ... ON DUPLICATE KEY UPDATE since you have UNIQUE constraint
        $sql = "INSERT INTO mark_attendance (student_id, course_id, group_name, session_id, status, participation) 
                VALUES (?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                status = VALUES(status), 
                participation = VALUES(participation),
                recorded_at = CURRENT_TIMESTAMP";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $student_id,
            $course,
            'group1', // You might want to pass group dynamically
            $session_id,
            $status,
            $participation
        ]);
        
        $count++;
    }
    
    $pdo->commit();
    echo json_encode(['success' => true, 'count' => $count, 'message' => 'Attendance saved successfully']);
    
} catch(PDOException $e) {
    if (isset($pdo)) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>