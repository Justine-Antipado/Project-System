<?php
if (ob_get_level())
    ob_end_clean();

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

if (!isset($_SESSION['adminUser'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized. Please log in.']);
    exit();
}

require_once 'connection.php';

try {
    $today = date('Y-m-d');

    // ── 1. Total Registered Students ──
    $totalStudents = $pdo->query('SELECT COUNT(*) FROM students')->fetchColumn();

    // ── 2. Events Scheduled Today ──
    $eventsToday = $pdo->prepare('SELECT COUNT(*) FROM events WHERE Date = :today');
    $eventsToday->execute([':today' => $today]);
    $eventsTodayCount = $eventsToday->fetchColumn();

    // ── 3. Ongoing Attendance (events with Status = Ongoing) ──
    $ongoingAttendance = $pdo->query("SELECT COUNT(*) FROM events WHERE Status = 'Ongoing'")->fetchColumn();

    // ── 4. Departmental Participation ──
    // Count distinct students per Program who have attended at least one event
    $deptStmt = $pdo->query('
        SELECT s.Program, COUNT(DISTINCT ea.StudentID) AS count
        FROM event_attendance ea
        INNER JOIN students s ON ea.StudentID = s.StudentID
        GROUP BY s.Program
        ORDER BY s.Program ASC
    ');
    $departments = $deptStmt->fetchAll(PDO::FETCH_ASSOC);

    // ── 5. Recent Activity Logs (last 10 scans) ──
    $logsStmt = $pdo->query('
        SELECT
            s.FirstName,
            s.LastName,
            s.Program,
            e.EventName,
            ea.Timestamp
        FROM event_attendance ea
        INNER JOIN students s  ON ea.StudentID = s.StudentID
        INNER JOIN events   e  ON ea.EventID   = e.EventID
        ORDER BY ea.Timestamp DESC
        LIMIT 5
    ');
    $recentLogs = $logsStmt->fetchAll(PDO::FETCH_ASSOC);

    // Format logs para sa frontend
    $formattedLogs = array_map(function ($log) {
        return [
            'name' => $log['FirstName'] . ' ' . $log['LastName'],
            'dept' => $log['Program'],
            'action' => 'Scanned In @ ' . $log['EventName'],
            'time' => date('h:i A', strtotime($log['Timestamp'])),
            'type' => 'scan',
        ];
    }, $recentLogs);

    echo json_encode([
        'success' => true,
        'totalStudents' => (int) $totalStudents,
        'eventsTodayCount' => (int) $eventsTodayCount,
        'ongoingAttendance' => (int) $ongoingAttendance,
        'departments' => $departments,
        'recentLogs' => $formattedLogs,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>