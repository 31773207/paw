<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

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
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'No data received']);
    exit;
}

$student_id = $input['student_id'];
$course = $input['course'];
$group = $input['group'];

try {
    $deleteStmt = $pdo->prepare("DELETE FROM mark_attendance WHERE student_id = ? AND course_id = ? AND group_name = ?");
    $deleteStmt->execute([$student_id, $course, $group]);
    
    $deletedCount = $deleteStmt->rowCount();
    
    echo json_encode([
        'success' => true, 
        'message' => 'Attendance records deleted successfully',
        'deleted_count' => $deletedCount
    ]);
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>