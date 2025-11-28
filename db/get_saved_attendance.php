<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$host = 'localhost';
$dbname = 'attendflow_db';
$username = 'root';
$password = '';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode([]);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $course = $input['course'];
    $studentIds = $input['student_ids'];
    
    if (empty($studentIds)) {
        echo json_encode([]);
        exit;
    }
    
    // Create placeholders for IN clause
    $placeholders = str_repeat('?,', count($studentIds) - 1) . '?';
    
    // Matches your exact column names
    $sql = "SELECT student_id, session_id, status, participation 
            FROM mark_attendance 
            WHERE course_id = ? AND student_id IN ($placeholders)";
    
    $stmt = $pdo->prepare($sql);
    $params = array_merge([$course], $studentIds);
    $stmt->execute($params);
    $attendance = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($attendance);
    
} catch(PDOException $e) {
    echo json_encode([]);
}
?>