<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$dbname = 'attendflow_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    
    // Test query
    $sql = "SELECT s.id, s.first_name, s.last_name 
            FROM students s
            JOIN enrollment e ON s.id = e.student_id
            WHERE e.course_id = 'webdev' AND e.student_group = 'group1'
            ORDER BY s.last_name";
    
    $stmt = $pdo->query($sql);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'count' => count($students),
        'students' => $students
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>