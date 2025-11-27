<?php
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'attendflow_db';

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
} else {
    echo "Database connected successfully!";
    
    // Test if tables exist
    $result = $conn->query("SHOW TABLES");
    echo "<br>Tables found: " . $result->num_rows;
}
?>




