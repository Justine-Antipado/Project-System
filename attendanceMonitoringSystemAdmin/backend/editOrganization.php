<?php
if (ob_get_level()) ob_end_clean();
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include_once 'connection.php';

$orgId   = trim($_POST['orgId']   ?? '');
$orgName = trim($_POST['orgName'] ?? '');

if (empty($orgId) || empty($orgName)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Organization ID and Name are required."]);
    exit;
}

try {
    // Check if org exists
    $check = $pdo->prepare("SELECT OrgID FROM organizations WHERE OrgID = ?");
    $check->execute([$orgId]);

    if ($check->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Organization not found."]);
        exit;
    }

    // Check for duplicate name (exclude current record)
    $dupCheck = $pdo->prepare("SELECT OrgID FROM organizations WHERE OrgName = ? AND OrgID != ?");
    $dupCheck->execute([$orgName, $orgId]);

    if ($dupCheck->rowCount() > 0) {
        http_response_code(409);
        echo json_encode(["success" => false, "message" => "Another organization with that name already exists."]);//ito din dapata sa field katulad ng required message
        exit;
    }

    $stmt = $pdo->prepare("UPDATE organizations SET OrgName = ? WHERE OrgID = ?");
    $stmt->execute([$orgName, $orgId]);

    echo json_encode([
        "success" => true,
        "message" => "Organization updated successfully.",
        "data" => [
            "OrgID"   => $orgId,
            "OrgName" => $orgName,
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>