<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'connection.php';  // your PDO connection file

try {
    // ── Collect optional filter params from query string ──
    $eventName = $_GET['event'] ?? '';
    $program = $_GET['program'] ?? '';
    $year = $_GET['year'] ?? '';
    $section = $_GET['section'] ?? '';
    $semester = $_GET['semester'] ?? '';

    // ── Base query (matches your SQL comment exactly) ──
    $sql = "
        SELECT 
            ea.EventAttendanceID                              AS id,
            CONCAT(s.FirstName, ' ', s.LastName)             AS name,
            e.EventName                                       AS event,
            s.Program                                         AS program,
            s.YearLevel                                       AS year,
            s.Section                                         AS section,
            CONCAT(sem.SemesterName, ' (', sy.YearRange, ')') AS semester
        FROM event_attendance ea
        INNER JOIN students     s   ON ea.StudentID  = s.StudentID
        INNER JOIN events       e   ON ea.EventID    = e.EventID
        INNER JOIN semesters    sem ON e.SemesterID  = sem.SemesterID
        INNER JOIN school_years sy  ON sem.YearID    = sy.YearID
        WHERE 1=1
    ";

    $params = [];

    // ── Append WHERE clauses only when a filter is provided ──
    if ($eventName !== '') {
        $sql .= ' AND e.EventName = :event';
        $params[':event'] = $eventName;
    }
    if ($program !== '') {
        $sql .= ' AND s.Program = :program';
        $params[':program'] = $program;
    }
    if ($year !== '') {
        $sql .= ' AND s.YearLevel = :year';
        $params[':year'] = (int) $year;
    }
    if ($section !== '') {
        $sql .= ' AND s.Section = :section';
        $params[':section'] = $section;
    }
    if ($semester !== '') {
        // Match the concatenated semester string, e.g. "1st Semester (2024-2025)"
        $sql .= " AND CONCAT(sem.SemesterName, ' (', sy.YearRange, ')') = :semester";
        $params[':semester'] = $semester;
    }

    $sql .= ' ORDER BY ea.Timestamp DESC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $students = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'data' => $students
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>