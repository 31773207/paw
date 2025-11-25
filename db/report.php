<?php
$students = file_exists('students.json') ? json_decode(file_get_contents('students.json'), true) : [];
$attendance = file_exists('attendance.json') ? json_decode(file_get_contents('attendance.json'), true) : [];

foreach ($students as $s) {
    $count = 0;
    foreach ($attendance as $date => $ids) {
        if (in_array($s['id'], $ids)) $count++;
    }
    echo "ID: {$s['id']}, Name: {$s['name']}, Group: {$s['group']}, Present Days: $count<br>";
}
?>
