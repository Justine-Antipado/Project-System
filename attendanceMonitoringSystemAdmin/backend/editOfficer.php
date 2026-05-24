<?php
if (ob_get_level()) ob_end_clean();
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include_once __DIR__ . '/connection.php';

$officersId = trim($_POST['officersId'] ?? '');
$orgName    = trim($_POST['orgName']    ?? '');
$position   = trim($_POST['position']  ?? '');

if (empty($officersId) || empty($orgName) || empty($position)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit;
}

try {
    // Check officer exists
    $check = $pdo->prepare("SELECT OfficersID FROM officers WHERE OfficersID = ?");
    $check->execute([$officersId]);
    if ($check->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Officer not found."]);
        exit;
    }

    // Resolve OrgID from OrgName
    $stmtOrg = $pdo->prepare("SELECT OrgID FROM organizations WHERE OrgName = ?");
    $stmtOrg->execute([$orgName]);
    $org = $stmtOrg->fetch();

    if (!$org) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Organization not found."]);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE officers SET OrgID = ?, Position = ? WHERE OfficersID = ?");
    $stmt->execute([$org['OrgID'], $position, $officersId]);

    echo json_encode([
        "success" => true,
        "message" => "Officer updated successfully.",
        "data" => [
            "OfficersID" => $officersId,
            "OrgName"    => $orgName,
            "Position"   => $position,
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>