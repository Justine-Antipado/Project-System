<?php
if (ob_get_level())
    ob_end_clean();
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once 'connection.php';

$officersId = trim($_POST['officersId'] ?? '');

if (empty($officersId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Officer ID is required.']);
    exit;
}

try {
    $check = $pdo->prepare('SELECT OfficersID FROM officers WHERE OfficersID = ?');
    $check->execute([$officersId]);

    if ($check->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Officer not found.']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM officers WHERE OfficersID = ?');
    $stmt->execute([$officersId]);

    echo json_encode([
        'success' => true,
        'message' => 'Officer deleted successfully.'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>