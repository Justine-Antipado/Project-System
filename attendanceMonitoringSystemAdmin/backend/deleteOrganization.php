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

$orgId = trim($_POST['orgId'] ?? '');

if (empty($orgId)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Organization ID is required.']);
    exit;
}

try {
    $check = $pdo->prepare('SELECT OrgID FROM organizations WHERE OrgID = ?');
    $check->execute([$orgId]);

    if ($check->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Organization not found.']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM organizations WHERE OrgID = ?');
    $stmt->execute([$orgId]);

    echo json_encode([
        'success' => true,
        'message' => 'Organization deleted successfully.'
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>