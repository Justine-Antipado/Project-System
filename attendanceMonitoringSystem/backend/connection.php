<?php
$db_name = "mysql:host=localhost;dbname=ams_db;port=3306;charset=utf8mb4";
$username = "root";
$password = "";


$PDO_code = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false
];
try {
    $pdo = new PDO($db_name, $username, $password, $PDO_code);
    echo "Database connected successfully!<br>";
} catch (PDOException $e) {
    echo "Connection failed: " , $e->getMessage();
}
?>
