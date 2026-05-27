<?php
// Set headers para sa Cross-Origin Resource Sharing (CORS) at JSON Content Type
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=UTF-8');

// I-handle ang preflight OPTIONS request ng Axios
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// I-include ang iyong hiwalay na connection script
require_once 'connection.php';

// Basahin ang JSON payload mula sa React Frontend
$data = json_decode(file_get_contents('php://input'), true);

// Siguraduhing kasama ang EventID para sa pag-update
if (
    empty($data['EventID']) ||
    empty($data['eventName']) ||
    empty($data['eventDate']) ||
    empty($data['venue']) ||
    empty($data['status']) ||
    empty($data['program']) ||
    empty($data['schoolYear']) ||
    empty($data['semester'])
) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
    exit();
}

// Kunin ang mga value mula sa React frontend
$eventId = intval($data['EventID']);
$eventName = trim($data['eventName']);
$eventDate = trim($data['eventDate']);
$venue = trim($data['venue']);
$status = trim($data['status']);
$program = trim($data['program']);
$schoolYear = trim($data['schoolYear']);
$semester = trim($data['semester']);

// I-normalize ang format ng semestre para tugma sa nakasulat sa database mo
if ($semester === '1st Sem') {
    $normalizedSemester = '1st Semester';
} elseif ($semester === '2nd Sem') {
    $normalizedSemester = '2nd Semester';
} else {
    $normalizedSemester = $semester;
}

try {
    // 1. Hahanapin muna ang YearID mula sa school_years gamit ang YearRange text
    $syQuery = 'SELECT YearID FROM `school_years` WHERE `YearRange` = :schoolYear LIMIT 1';
    $stmt1 = $pdo->prepare($syQuery);
    $stmt1->execute([':schoolYear' => $schoolYear]);
    $yearRow = $stmt1->fetch();

    if (!$yearRow) {
        echo json_encode(['status' => 'error', 'message' => 'School Year tracking entry not found.']);
        exit();
    }

    $yearId = $yearRow['YearID'];

    // 2. Hahanapin naman ang tamang SemesterID gamit ang nahanap na YearID at ang ginamit na SemesterName
    $semQuery = 'SELECT SemesterID FROM `semesters` WHERE `YearID` = :yearId AND `SemesterName` = :semesterName LIMIT 1';
    $stmt2 = $pdo->prepare($semQuery);
    $stmt2->execute([
        ':yearId' => $yearId,
        ':semesterName' => $normalizedSemester
    ]);
    $semRow = $stmt2->fetch();

    if (!$semRow) {
        echo json_encode(['status' => 'error', 'message' => 'Matching Semester for this School Year not found.']);
        exit();
    }

    $semesterId = $semRow['SemesterID'];

    // ─── CHECK KUNG MAY DUPLICATE NA EVENT NAME SA SEMESTRE NA ITO (Excluding ang sarili nitong EventID) ───
    $checkDuplicateQuery = 'SELECT COUNT(*) FROM `events` WHERE `EventName` = :eventName AND `SemesterID` = :semesterId AND `EventID` != :eventId LIMIT 1';
    $stmtCheck = $pdo->prepare($checkDuplicateQuery);
    $stmtCheck->execute([
        ':eventName' => $eventName,
        ':semesterId' => $semesterId,
        ':eventId' => $eventId
    ]);

    if ($stmtCheck->fetchColumn() > 0) {
        echo json_encode([
            'status' => 'duplicate',
            'message' => 'An event with this name already exists in the selected semester.'
        ]);
        exit();
    }

    // 3. I-update na ang Event data base sa EventID nito
    $updateQuery = 'UPDATE `events` 
                    SET `EventName` = :eventName, 
                        `Date` = :eventDate, 
                        `Venue` = :venue, 
                        `Status` = :status, 
                        `Program` = :program, 
                        `SemesterID` = :semesterId 
                    WHERE `EventID` = :eventId';

    $stmt3 = $pdo->prepare($updateQuery);

    $success = $stmt3->execute([
        ':eventName' => $eventName,
        ':eventDate' => $eventDate,
        ':venue' => $venue,
        ':status' => $status,
        ':program' => $program,
        ':semesterId' => $semesterId,
        ':eventId' => $eventId
    ]);

    if ($success) {
        echo json_encode(['status' => 'success', 'message' => 'Event configuration updated successfully!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to execute event update.']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database Error: ' . $e->getMessage()]);
}
?>