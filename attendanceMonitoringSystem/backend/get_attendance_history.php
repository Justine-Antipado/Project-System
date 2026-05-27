<?php
// get_attendance_history.php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
header('Content-Type: application/json');
include_once 'connection.php';

// 1. Suriin kung may naka-login na student
if (!isset($_SESSION['studentUser'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized. No active session found.']);
    exit();
}

// Kunin ang StudentID mula sa session data na sinef sa login_auth.php
$studentID = $_SESSION['studentUser']['StudentID'] ?? null;

if (!$studentID) {
    http_response_code(400);
    echo json_encode(['message' => 'Session StudentID is missing.']);
    exit();
}

try {
    /* 2. SQL QUERY: I-join ang event_attendance at events table 
         para makuha ang pangalan ng event, date, venue, at time ng pag-scan.
    */
    $query = "
        SELECT 
            ea.EventAttendanceID AS id,
            e.EventName AS event,
            e.Venue AS venue,
            e.Date AS event_date,
            ea.Timestamp AS timeIn
        FROM event_attendance ea
        INNER JOIN events e ON ea.EventID = e.EventID
        WHERE ea.StudentID = :studentID
        ORDER BY ea.Timestamp DESC
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute([':studentID' => $studentID]);
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. I-format ang values para madaling basahin sa React (Gaya ng Date at Time format mo)
    $formattedRecords = array_map(function($row) {
        $timestamp = strtotime($row['timeIn']);
        
        // Halimbawa: "May 25, 2026"
        $formattedDate = date("F d, Y", $timestamp); 
        // Halimbawa: "10 : 04 AM"
        $formattedTime = date("h : i A", $timestamp);

        // Maglagay ng random o sequential accent color para sa UI card stripes mo kung gusto mo
        $accents = ['accent-blue', 'accent-yellow', 'accent-green'];
        $randomAccent = $accents[$row['id'] % count($accents)];

        return [
            'id' => (int)$row['id'],
            'date' => $formattedDate,
            'event' => $row['event'],
            'venue' => $row['venue'],
            'timeIn' => $formattedTime,
            'accent' => $randomAccent
        ];
    }, $records);

    http_response_code(200);
    echo json_encode($formattedRecords);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
}
?>