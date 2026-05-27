<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

session_start();
include_once 'connection.php';

if (!isset($_SESSION['adminUser'])) {
    http_response_code(401);
    echo json_encode(['authenticated' => false, 'message' => 'No active session found.']);
    exit();
}

http_response_code(200);
echo json_encode([
    'authenticated' => true,
    'user'          => $_SESSION['adminUser']
]);
?>