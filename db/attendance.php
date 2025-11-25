<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $date = $_POST['date'] ?? '';
    $present_ids = $_POST['present_ids'] ?? [];

    if (!$date) {
        echo "Date is required";
        exit;
    }

    $file = 'attendance.json';
    $attendance = file_exists($file) ? json_decode(file_get_contents($file), true) : [];

    $attendance[$date] = $present_ids;
    file_put_contents($file, json_encode($attendance, JSON_PRETTY_PRINT));
    echo "Attendance saved";
}
?>

