<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Database configuration
$host = 'localhost';
$dbname = 'attendflow_db';
$username = 'root';
$password = '';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $pdo->beginTransaction();
    
    // 1. Check if student exists
    $checkSql = "SELECT id FROM students WHERE id = ?";
    $checkStmt = $pdo->prepare($checkSql);
    $checkStmt->execute([$input['id']]);
    
    if ($checkStmt->fetch()) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'error' => 'Student ID already exists']);
        exit;
    }
    
    // 2. Insert student - only basic fields
    $studentSql = "INSERT INTO students (id, last_name, first_name) 
                   VALUES (?, ?, ?)";
    $studentStmt = $pdo->prepare($studentSql);
    $studentResult = $studentStmt->execute([
        $input['id'],
        $input['lastName'],
        $input['firstName']
    ]);
    
    if (!$studentResult) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'error' => 'Failed to add student']);
        exit;
    }
    
    // 3. Enroll in course - WITHOUT enrollment_date
    $enrollmentSql = "INSERT INTO enrollment (student_id, course_id, student_group) 
                      VALUES (?, ?, ?)";
    $enrollmentStmt = $pdo->prepare($enrollmentSql);
    $enrollmentResult = $enrollmentStmt->execute([
        $input['id'],
        $input['course'],
        $input['group']
    ]);
    
    if (!$enrollmentResult) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'error' => 'Failed to enroll student']);
        exit;
    }
    
    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Student added and enrolled successfully!']);
    
} catch(PDOException $e) {
    if (isset($pdo)) $pdo->rollBack();
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>