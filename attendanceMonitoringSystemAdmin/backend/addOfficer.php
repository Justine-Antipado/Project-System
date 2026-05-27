<?php
if (ob_get_level())
    ob_end_clean();
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once __DIR__ . '/connection.php';

$schoolIDNo = trim($_POST['schoolIDNo'] ?? '');
$orgName = trim($_POST['orgName'] ?? '');
$position = trim($_POST['position'] ?? '');

if (empty($schoolIDNo) || empty($orgName) || empty($position)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

try {
    // Resolve StudentID from SchoolIDNo
    $stmtStu = $pdo->prepare('SELECT StudentID FROM students WHERE SchoolIDNo = ?');
    $stmtStu->execute([$schoolIDNo]);
    $student = $stmtStu->fetch();

    if (!$student) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Student ID not found.']);
        exit;
    }

    // Resolve OrgID from OrgName
    $stmtOrg = $pdo->prepare('SELECT OrgID FROM organizations WHERE OrgName = ?');
    $stmtOrg->execute([$orgName]);
    $org = $stmtOrg->fetch();

    if (!$org) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Organization not found.']);
        exit;
    }

    // Check if officer already exists for this student + org
    $dupCheck = $pdo->prepare('SELECT OfficersID FROM officers WHERE StudentID = ? AND OrgID = ?');
    $dupCheck->execute([$student['StudentID'], $org['OrgID']]);
    if ($dupCheck->rowCount() > 0) {
        http_response_code(409);
        echo json_encode([
            'success' => false,
            'field' => 'studentId',  // ✅ tells React which field to target
            'message' => 'This student is already an officer of that organization.'
        ]);
        exit;
    }

    $stmt = $pdo->prepare('INSERT INTO officers (StudentID, OrgID, Position) VALUES (?, ?, ?)');
    $stmt->execute([$student['StudentID'], $org['OrgID'], $position]);

    $newId = $pdo->lastInsertId();

    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Officer added successfully.',
        'data' => [
            'OfficersID' => $newId,
            'SchoolIDNo' => $schoolIDNo,
            'OrgName' => $orgName,
            'Position' => $position,
        ]
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>