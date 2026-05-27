<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Content-Type: application/json');

require_once 'connection.php';

$eventId = isset($_GET['eventId']) ? intval($_GET['eventId']) : 0;

if ($eventId <= 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid or missing eventId']);
    exit;
}

try {
    $sql = "
        SELECT 
            ea.EventAttendanceID,
            ea.EventID,
            ea.Timestamp,

            -- Student na nag-attend
            s.SchoolIDNo,
            s.LastName,
            s.FirstName,
            s.MiddleName,
            s.Program,
            s.YearLevel,
            s.section AS Section,

            -- Officer na nag-scan (pangalan galing sa students table)
            CONCAT(so.FirstName, ' ', so.LastName) AS ScannedByName,
            o.Position AS ScannedByPosition

        FROM event_attendance ea

        -- Join para sa student na nag-attend
        LEFT JOIN students s ON ea.StudentID = s.StudentID

        -- Join para sa officer na nag-scan
        LEFT JOIN officers o ON ea.ScannedBy = o.OfficersID

        -- Join ulit sa students para sa pangalan ng officer
        LEFT JOIN students so ON o.StudentID = so.StudentID

        WHERE ea.EventID = :eventId

        ORDER BY ea.Timestamp ASC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':eventId', $eventId, PDO::PARAM_INT);
    $stmt->execute();

    $results = $stmt->fetchAll();

    if (count($results) === 0) {
        echo json_encode([
            'status' => 'success',
            'eventId' => $eventId,
            'count' => 0,
            'data' => []
        ]);
    } else {
        echo json_encode([
            'status' => 'success',
            'eventId' => $eventId,
            'count' => count($results),
            'data' => $results
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Query failed: ' . $e->getMessage()
    ]);
}
?>