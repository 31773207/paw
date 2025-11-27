<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Turn on error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database configuration
$host = 'localhost';
$dbname = 'attendflow_db';
$username = 'root';
$password = ''; // Your password here if any

// Get parameters
$course = $_GET['course'] ?? 'WEB101';
$group = $_GET['group'] ?? 'Group 01';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "/* Connected to database successfully */\n";
    
    // First, check if students table has data
    $checkStmt = $pdo->query("SELECT COUNT(*) as count FROM students");
    $studentCount = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    // Check if enrollment table has data
    $checkEnroll = $pdo->query("SELECT COUNT(*) as count FROM enrollment");
    $enrollCount = $checkEnroll->fetch(PDO::FETCH_ASSOC);
    
    echo "/* Students in database: " . $studentCount['count'] . " */\n";
    echo "/* Enrollments in database: " . $enrollCount['count'] . " */\n";
    
    // Get students enrolled in the course and group
    $sql = "SELECT s.id, s.last_name, s.first_name 
            FROM students s 
            JOIN enrollment e ON s.id = e.student_id 
            WHERE e.course_id = ? AND e.student_group = ?";
    
    echo "/* SQL Query: " . $sql . " */\n";
    echo "/* Parameters: course=$course, group=$group */\n";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$course, $group]);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "/* Found " . count($students) . " students */\n";
    
    // If no students found, try to get all students as fallback
    if (empty($students)) {
        echo "/* No enrolled students found, trying to get all students */\n";
        $allStmt = $pdo->query("SELECT id, last_name, first_name FROM students LIMIT 10");
        $students = $allStmt->fetchAll(PDO::FETCH_ASSOC);
        echo "/* Found " . count($students) . " total students */\n";
    }
    
    echo json_encode($students);
    
} catch(PDOException $e) {
    $error = 'Database error: ' . $e->getMessage();
    echo "/* ERROR: " . $error . " */\n";
    echo json_encode(['error' => $error]);
}
?>