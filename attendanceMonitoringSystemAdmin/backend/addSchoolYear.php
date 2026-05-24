<?php
if (ob_get_level()) ob_end_clean();
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

include_once __DIR__ . '/connection.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['yearRange'])) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "yearRange is required."]);
    exit;
}

$yearRange = trim($data['yearRange']);

try {
    // Duplicate check using the UNIQUE KEY on YearRange
    $check = $pdo->prepare("SELECT YearID FROM school_years WHERE YearRange = ?");
    $check->execute([$yearRange]);

    if ($check->rowCount() > 0) {
        echo json_encode(["status" => "error", "message" => "School Year already exists."]);
        exit;
    }

    $pdo->beginTransaction();

    // YearID is AUTO_INCREMENT — only insert YearRange
    $insertSY = $pdo->prepare("INSERT INTO school_years (YearRange) VALUES (?)");
    $insertSY->execute([$yearRange]);

    $newYearID = (int) $pdo->lastInsertId();

    // Auto-create 1st Semester and 2nd Semester
    $insertSem = $pdo->prepare("INSERT INTO semesters (YearID, SemesterName) VALUES (?, ?)");
    $insertSem->execute([$newYearID, "1st Semester"]);
    $insertSem->execute([$newYearID, "2nd Semester"]);

    $pdo->commit();

    echo json_encode([
        "status"    => "success",
        "message"   => "School Year and Semesters added successfully.",
        "yearID"    => $newYearID,
        "yearRange" => $yearRange
    ]);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>