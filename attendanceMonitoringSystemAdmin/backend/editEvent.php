<?php
// updateEvent.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$eventId    = intval($data['EventID']    ?? 0);
$eventName  = trim($data['EventName']   ?? '');
$date       = trim($data['Date']        ?? '');
$venue      = trim($data['Venue']       ?? '');
$status     = trim($data['Status']      ?? '');
$semesterId = intval($data['SemesterID'] ?? 0);

if (!$eventId || !$eventName || !$date || !$venue || !$status || !$semesterId) {
    http_response_code(400);
    echo json_encode(["error" => "All fields including EventID are required."]);
    exit;
}

$stmt = $conn->prepare(
    "UPDATE events
     SET EventName = ?, Date = ?, Venue = ?, Status = ?, SemesterID = ?
     WHERE EventID = ?"
);
$stmt->bind_param("ssssii", $eventName, $date, $venue, $status, $semesterId, $eventId);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>