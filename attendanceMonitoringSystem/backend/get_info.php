<?php
// get_info.php
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

if (!isset($_SESSION['studentUser'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized. No session found.']);
    exit();
}

$schoolIDNo = $_SESSION['studentUser']['SchoolIDNo'] ?? null;

if (!$schoolIDNo) {
    http_response_code(400);
    echo json_encode(['message' => 'Session SchoolIDNo is missing.']);
    exit();
}

try {
    // 1. Kunin ang full profile ng student (kasama StudentID, QRCode, etc.)
    $stmt = $pdo->prepare("SELECT StudentID, SchoolIDNo, LastName, FirstName, MiddleName,
                                  Program, YearLevel, section, StudentQRCode
                           FROM students WHERE SchoolIDNo = :id LIMIT 1");
    $stmt->execute([':id' => $schoolIDNo]);
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        http_response_code(404);
        echo json_encode(['message' => 'Student not found.']);
        exit();
    }

    $studentID = (int)$student['StudentID'];

    // 2. Bilang ng events na naattend — gamit ang StudentID (int), hindi SchoolIDNo
    $stmtCount = $pdo->prepare(
        "SELECT COUNT(*) as total_attended FROM event_attendance WHERE StudentID = :sid"
    );
    $stmtCount->execute([':sid' => $studentID]);
    $totalEvents = (int)($stmtCount->fetch(PDO::FETCH_ASSOC)['total_attended'] ?? 0);

    // 3. Attendance rate — based sa total events na naipost
    $stmtTotal = $pdo->query("SELECT COUNT(*) as total FROM events");
    $totalAllEvents = (int)($stmtTotal->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

    $attendanceRate = $totalAllEvents > 0
        ? round(($totalEvents / $totalAllEvents) * 100)
        : 0;

    // 4. Ibalik lahat
    $student['totalEvents']    = $totalEvents;
    $student['attendanceRate'] = $attendanceRate;

    http_response_code(200);
    echo json_encode($student);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'DB error: ' . $e->getMessage()]);
}
?>