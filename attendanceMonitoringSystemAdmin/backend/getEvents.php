<?php
// getEvents.php
//header("Access-Control-Allow-Origin: *");

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');
header("Content-Type: application/json");
require_once 'connetion.php'; // Your existing DB connection file

$sql = "
    SELECT
        e.EventID,
        e.EventName,
        e.Date,
        e.Venue,
        e.Status,
        e.SemesterID,
        s.SemesterName,
        sy.YearRange
    FROM events e
    LEFT JOIN semesters s  ON e.SemesterID = s.SemesterID
    LEFT JOIN school_years sy ON s.YearID = sy.YearID
    ORDER BY e.Date DESC
";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(["error" => $conn->error]);
    exit;
}

$events = [];
while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

echo json_encode($events);
$conn->close();
?>