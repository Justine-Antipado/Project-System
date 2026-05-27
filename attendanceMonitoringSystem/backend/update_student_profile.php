<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

session_start();
include_once 'connection.php';

if (!isset($_SESSION['studentUser'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized.']);
    exit();
}

$studentID  = $_SESSION['studentUser']['StudentID'];  // ← make sure this key matches your session

$email      = isset($_POST['email'])      ? trim($_POST['email'])      : null;
$lastName   = isset($_POST['lastName'])   ? trim($_POST['lastName'])   : null;
$firstName  = isset($_POST['firstName'])  ? trim($_POST['firstName'])  : null;
$middleName = isset($_POST['middleName']) ? trim($_POST['middleName']) : '';
$program    = isset($_POST['program'])    ? trim($_POST['program'])    : null;
$yearLevel  = isset($_POST['yearLevel'])  ? trim($_POST['yearLevel'])  : null;
$section    = isset($_POST['section'])    ? trim($_POST['section'])    : null;

if (!$email || !$lastName || !$firstName || !$program || !$yearLevel || !$section) {
    http_response_code(400);
    echo json_encode(['message' => 'All required fields must be filled.']);
    exit();
}

try {
    $stmt = $pdo->prepare("
        UPDATE students
        SET Email      = :email,
            LastName   = :lastName,
            FirstName  = :firstName,
            MiddleName = :middleName,
            Program    = :program,
            YearLevel  = :yearLevel,
            section    = :section
        WHERE StudentID = :studentID
    ");
    $stmt->execute([
        ':email'      => $email,
        ':lastName'   => $lastName,
        ':firstName'  => $firstName,
        ':middleName' => $middleName,
        ':program'    => $program,
        ':yearLevel'  => $yearLevel,
        ':section'    => $section,
        ':studentID'  => $studentID,
    ]);

    // Refresh session so the page reflects updated data immediately
    $_SESSION['studentUser']['Email']      = $email;
    $_SESSION['studentUser']['LastName']   = $lastName;
    $_SESSION['studentUser']['FirstName']  = $firstName;
    $_SESSION['studentUser']['MiddleName'] = $middleName;
    $_SESSION['studentUser']['Program']    = $program;
    $_SESSION['studentUser']['YearLevel']  = $yearLevel;
    $_SESSION['studentUser']['section']    = $section;  // ← lowercase to match DB + React

    echo json_encode(['success' => true, 'message' => 'Profile updated successfully!']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'DB error: ' . $e->getMessage()]);
}
?>