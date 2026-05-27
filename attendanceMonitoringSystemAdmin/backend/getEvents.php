<?php
// getEvents.php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'connection.php';

$sql = '
    SELECT
        e.EventID,
        e.EventName,
        e.Date,
        e.Venue,
        e.Status,
        e.Program,
        e.SemesterID,
        s.SemesterName,
        sy.YearRange
    FROM events e
    LEFT JOIN semesters s   ON e.SemesterID = s.SemesterID
    LEFT JOIN school_years sy ON s.YearID = sy.YearID
    ORDER BY e.Date DESC
';

$result = $pdo->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(['error' => $pdo->errorInfo()[2]]);
    exit;
}

$events = $result->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($events);

$pdo = null;
?>