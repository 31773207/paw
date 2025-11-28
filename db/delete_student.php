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

if (!$input || !isset($input['id'])) {
    echo json_encode(['success' => false, 'error' => 'No student ID received']);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Delete from enrollment first (foreign key constraint)
    $sql1 = "DELETE FROM enrollment WHERE student_id = ?";
    $stmt1 = $pdo->prepare($sql1);
    $stmt1->execute([$input['id']]);
    
    // Delete from attendance
    $sql2 = "DELETE FROM attendance WHERE student_id = ?";
    $stmt2 = $pdo->prepare($sql2);
    $stmt2->execute([$input['id']]);
    
    // Delete from students
    $sql3 = "DELETE FROM students WHERE id = ?";
    $stmt3 = $pdo->prepare($sql3);
    $stmt3->execute([$input['id']]);
    
    if ($stmt3->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Student deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Student not found']);
    }
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>