<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['student_id'] ?? '';
    $name = $_POST['name'] ?? '';
    $group = $_POST['group'] ?? '';

    if (!$id || !$name || !$group) {
        echo "All fields are required";
        exit;
    }

    $file = 'students.json';
    $students = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

    foreach ($students as $student) {
        if ($student['id'] === $id) {
            echo "Student ID already exists";
            exit;
        }
    }

    $students[] = ["id"=>$id, "name"=>$name, "group"=>$group];
    file_put_contents($file, json_encode($students, JSON_PRETTY_PRINT));
    echo "Student added successfully";
}
?>
