<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once '../config.php';

$data = json_decode(file_get_contents('php://input'), true);

foreach ($data as $record) {
    $sql = "INSERT INTO attendance (student_id, course_id, session_number, attendance_date, status, participation) 
            VALUES (?, 'WEB101', 1, CURDATE(), ?, ?) 
            ON DUPLICATE KEY UPDATE status = ?, participation = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", 
        $record['student_id'], 
        $record['status'], 
        $record['participation'],
        $record['status'],
        $record['participation']
    );
    $stmt->execute();
}

echo json_encode(['success' => true, 'message' => 'Attendance updated!']);
?>