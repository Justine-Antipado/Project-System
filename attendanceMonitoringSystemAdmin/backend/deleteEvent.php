<?php
// deleteEvent.php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once 'connection.php';  // your existing connection file

// Read JSON body sent by axios
$data = json_decode(file_get_contents('php://input'), true);
$eventId = intval($data['EventID'] ?? 0);

if (!$eventId) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'EventID is required.']);
    exit;
}

try {
    // Check if event exists first
    $check = $pdo->prepare('SELECT EventID FROM events WHERE EventID = ?');
    $check->execute([$eventId]);

    if ($check->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Event not found.']);
        exit;
    }

    $stmt = $pdo->prepare('DELETE FROM events WHERE EventID = ?');
    $stmt->execute([$eventId]);  // fixed: was $EventId (typo)

    echo json_encode(['success' => true, 'message' => 'Event deleted successfully.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>