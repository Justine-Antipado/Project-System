<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');  // Para tanggapin ang session cookie

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

header('Content-Type: application/json');

// Tingnan kung may active session user
if (isset($_SESSION['studentUser'])) {
    http_response_code(200);
    echo json_encode([
        'authenticated' => true,
        'user' => $_SESSION['studentUser']
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        'authenticated' => false,
        'message' => 'No active session found.'
    ]);
}
?>