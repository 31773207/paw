<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$dbname = 'attendflow_db';
$username = 'root';
$password = '';

$course = $_GET['course'] ?? 'WEB101';
$group = $_GET['group'] ?? 'Group 01';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $sql = "SELECT s.id, s.last_name, s.first_name 
            FROM students s 
            JOIN enrollment e ON s.id = e.student_id 
            WHERE e.course_id = ? AND e.student_group = ?";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$course, $group]);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Fallback if no students
    if (empty($students)) {
        $allStmt = $pdo->query("SELECT id, last_name, first_name FROM students LIMIT 10");
        $students = $allStmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    echo json_encode($students);
    
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>