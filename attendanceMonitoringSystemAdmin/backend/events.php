<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once 'connection.php';

try {
    $sql = "
        SELECT 
            e.EventID                                          AS id,
            e.EventName                                        AS name,
            e.SemesterID                                       AS semesterId,
            CONCAT(sem.SemesterName, ' (', sy.YearRange, ')') AS semester
        FROM events e
        INNER JOIN semesters    sem ON e.SemesterID = sem.SemesterID
        INNER JOIN school_years sy  ON sem.YearID   = sy.YearID
        ORDER BY e.Date DESC
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $events = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "data"    => $events
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>