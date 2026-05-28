<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'connection.php';  // loads $pdo

$input = json_decode(file_get_contents('php://input'), true);
$eventId = isset($input['eventId']) ? intval($input['eventId']) : 0;
$qrCode = isset($input['qrCode']) ? trim($input['qrCode']) : '';
$scannedBy = isset($input['scannedBy']) ? intval($input['scannedBy']) : null;

if (!$eventId || !$qrCode) {
    echo json_encode(['status' => 'error', 'message' => 'Missing eventId or qrCode.']);
    exit();
}

try {
    // 1. Look up student by QR code
    $stmt = $pdo->prepare('
        SELECT StudentID, LastName, FirstName, MiddleName, Program, YearLevel
        FROM students
        WHERE StudentQRCode = :qrCode
        LIMIT 1
    ');
    $stmt->execute([':qrCode' => $qrCode]);
    $student = $stmt->fetch();

    if (!$student) {
        echo json_encode([
            'status' => 'not_found',
            'message' => 'Student not found. QR code is not registered in the system.'
        ]);
        exit();
    }

    $studentId = $student['StudentID'];

    // 2. Check for duplicate (same EventID + StudentID)
    $stmt2 = $pdo->prepare('
        SELECT EventAttendanceID
        FROM event_attendance
        WHERE EventID = :eventId AND StudentID = :studentId
        LIMIT 1
    ');
    $stmt2->execute([':eventId' => $eventId, ':studentId' => $studentId]);

    if ($stmt2->fetch()) {
        echo json_encode([
            'status' => 'duplicate',
            'message' => 'Student is already registered for this event.',
            'student' => [
                'lastName' => $student['LastName'],
                'firstName' => $student['FirstName'],
                'middleName' => $student['MiddleName'] ?? '',
                'program' => $student['Program'],
                'yearLevel' => $student['YearLevel'],
            ]
        ]);
        exit();
    }

    // 3. Insert attendance record
    $stmt3 = $pdo->prepare('
        INSERT INTO event_attendance (EventID, StudentID, ScannedBy)
        VALUES (:eventId, :studentId, :scannedBy)
    ');
    $stmt3->execute([
        ':eventId' => $eventId,
        ':studentId' => $studentId,
        ':scannedBy' => $scannedBy ?: null,
    ]);

    $attendanceId = $pdo->lastInsertId();

    echo json_encode([
        'status' => 'success',
        'message' => 'Attendance recorded successfully.',
        'attendanceId' => $attendanceId,
        'student' => [
            'lastName' => $student['LastName'],
            'firstName' => $student['FirstName'],
            'middleName' => $student['MiddleName'] ?? '',
            'program' => $student['Program'],
            'yearLevel' => $student['YearLevel'],
        ]
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>