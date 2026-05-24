<?php
if (ob_get_level()) ob_end_clean();
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include_once 'connection.php';

$orgName = trim($_POST['orgName'] ?? '');

if (empty($orgName)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Organization name is required."]);
    exit;
}

try {
    // Check for duplicate name
    $check = $pdo->prepare("SELECT OrgID FROM organizations WHERE OrgName = ?");
    $check->execute([$orgName]);

    if ($check->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(["success" => false, "message" => "Organization already exists."]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO organizations (OrgName) VALUES (?)");
    $stmt->execute([$orgName]);

    $newId = $pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Organization created successfully.",
        "data" => [
            "OrgID"   => $newId,
            "OrgName" => $orgName,
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>