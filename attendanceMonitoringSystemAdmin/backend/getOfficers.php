<?php
if (ob_get_level()) ob_end_clean();
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include_once __DIR__ . '/connection.php';

try {
    // JOIN to get readable SchoolIDNo and OrgName instead of raw IDs
    $stmt = $pdo->query("
        SELECT 
            o.OfficersID,
            s.SchoolIDNo,
            org.OrgName,
            o.Position
        FROM officers o
        JOIN students s     ON o.StudentID = s.StudentID
        JOIN organizations org ON o.OrgID  = org.OrgID
        ORDER BY o.OfficersID DESC
    ");
    $data = $stmt->fetchAll();

    echo json_encode(["success" => true, "data" => $data]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>