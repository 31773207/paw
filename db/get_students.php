<?php
$file = 'students.json';
if (file_exists($file)) {
    $students = file_get_contents($file);
    echo $students;
} else {
    echo "[]";
}
?>
