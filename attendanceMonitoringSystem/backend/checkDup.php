<?php

if (ob_get_level())
    ob_end_clean();

// I-allow ang iyong React frontend origin
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include_once 'connection.php';


try {
    // Binago para gumamit ng $pdo variable para pareho sila ng implementation ng register.php mo
    $stmt = $pdo->query("SELECT SchoolIDNo, Email FROM students");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($data);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to fetch existing validation list: ' . $e->getMessage()]);
}
?>