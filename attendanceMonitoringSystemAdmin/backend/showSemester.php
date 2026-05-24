<?php
if (ob_get_level()) ob_end_clean();
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include_once __DIR__ . '/connection.php';

try {
    $stmt = $pdo->query("
        SELECT 
            s.SemesterID,
            s.YearID,
            s.SemesterName,
            sy.YearRange
        FROM semesters s
        INNER JOIN school_years sy ON s.YearID = sy.YearID
        ORDER BY s.YearID DESC, s.SemesterID ASC
    ");
    $data = $stmt->fetchAll();
    echo json_encode(["status" => "success", "data" => $data]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>