<?php
header('Content-Type: text/plain');
header('Access-Control-Allow-Origin: *');

error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'localhost';
$dbname = 'attendflow_db';
$username = 'root';
$password = '';

echo "Testing database connection...\n\n";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Database connected successfully!\n\n";
    
    // Check tables
    $tables = ['students', 'enrollment', 'mark_attendance'];
    
    foreach ($tables as $table) {
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM $table");
        $count = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "Table '$table': {$count['count']} records\n";
    }
    
    // Check some sample data
    echo "\nSample mark_attendance records:\n";
    $stmt = $pdo->query("SELECT student_id, session_id, status, participation FROM mark_attendance LIMIT 5");
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($records as $record) {
        echo "Student {$record['student_id']} - Session {$record['session_id']}: {$record['status']} (participation: {$record['participation']})\n";
    }
    
} catch(PDOException $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
}
?>