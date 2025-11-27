<?php
// Turn on error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: text/plain'); // Use text/plain for debugging

$host = 'localhost';
$dbname = 'attendflow_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    echo "✅ Database connected successfully!\n\n";
    
    // Check if students table has data
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM students");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Students in database: " . $result['count'] . "\n\n";
    
    // Check if enrollment table has data  
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM enrollment");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Enrollments in database: " . $result['count'] . "\n\n";
    
    // Try to get students with enrollment
    $sql = "SELECT s.id, s.last_name, s.first_name 
            FROM students s 
            JOIN enrollment e ON s.id = e.student_id 
            WHERE e.course_id = 'WEB101' AND e.student_group = 'Group 01'";
    
    echo "SQL Query: " . $sql . "\n\n";
    
    $stmt = $pdo->query($sql);
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Found " . count($students) . " students:\n";
    print_r($students);
    
} catch(PDOException $e) {
    echo "❌ Database Error: " . $e->getMessage() . "\n";
} catch(Exception $e) {
    echo "❌ General Error: " . $e->getMessage() . "\n";
}
?>