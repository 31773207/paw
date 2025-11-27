<?php
include "db.php";

$email = $_POST['email'];
$password = $_POST['password'];
$role = $_POST['role'];

$sql = "SELECT * FROM users WHERE email='$email' AND password='$password' AND role='$role'";
$result = $conn->query($sql);

if ($result->num_rows == 1) {
    session_start();
    $_SESSION['role'] = $role;

    if ($role == "professor") {
        header("Location: professor_home.php");
    } elseif ($role == "student") {
        header("Location: student_home.php");
    } elseif ($role == "admin") {
        header("Location: admin_home.php");
    }
} else {
    echo "Invalid login";
}
?>
