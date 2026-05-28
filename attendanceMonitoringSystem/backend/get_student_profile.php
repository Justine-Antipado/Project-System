<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

if (!isset($_SESSION['studentUser'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized. No active session.']);
    exit();
}

// Return the session data (already stripped of Password in login_auth.php)
http_response_code(200);
echo json_encode([
    'success' => true,
    'user' => $_SESSION['studentUser']
]);
?>