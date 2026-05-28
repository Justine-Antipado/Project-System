<?php
if (ob_get_level())
    ob_end_clean();

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, OPTIONS');
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

$studentID = $_SESSION['adminUser']['StudentID'];

// ── Decode JSON body ──
$body = json_decode(file_get_contents('php://input'), true);

if (!$body) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request body.']);
    exit();
}

// ── Sanitize & pull fields ──
$email = trim($body['email'] ?? '');
$lastName = trim($body['lastName'] ?? '');
$firstName = trim($body['firstName'] ?? '');
$middleName = trim($body['middleName'] ?? '');
$program = trim($body['program'] ?? '');
$yearLevel = trim($body['yearLevel'] ?? '');
$section = trim($body['section'] ?? '');
$orgName = trim($body['organization'] ?? '');
$position = trim($body['position'] ?? '');
$termYear = trim($body['term_year'] ?? '');  // e.g. "2025-2026" string

// ── Basic server-side validation ──
if (!$email || !$lastName || !$firstName || !$program || !$yearLevel || !$section || !$orgName || !$position || !$termYear) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'All required fields must be filled.']);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Invalid email address format.']);
    exit();
}

try {
    // ── Resolve OrgID from OrgName ──
    $orgStmt = $pdo->prepare('SELECT OrgID FROM organizations WHERE OrgName = :orgName LIMIT 1');
    $orgStmt->execute([':orgName' => $orgName]);
    $org = $orgStmt->fetch(PDO::FETCH_ASSOC);

    if (!$org) {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => 'Selected organization not found.']);
        exit();
    }

    $orgID = $org['OrgID'];

    // ── Update students table ──
    $stuStmt = $pdo->prepare('
        UPDATE students
        SET
            Email      = :email,
            LastName   = :lastName,
            FirstName  = :firstName,
            MiddleName = :middleName,
            Program    = :program,
            YearLevel  = :yearLevel,
            section    = :section
        WHERE StudentID = :studentID
    ');

    $stuStmt->execute([
        ':email' => $email,
        ':lastName' => $lastName,
        ':firstName' => $firstName,
        ':middleName' => $middleName,
        ':program' => $program,
        ':yearLevel' => $yearLevel,
        ':section' => $section,
        ':studentID' => $studentID,
    ]);

    // ── Update officers table ──
    // officers.TermYear stores the YearRange string directly e.g. '2025-2026'
    $offStmt = $pdo->prepare('
        UPDATE officers
        SET
            OrgID    = :orgID,
            Position = :position,
            TermYear = :termYear
        WHERE StudentID = :studentID
    ');

    $offStmt->execute([
        ':orgID' => $orgID,
        ':position' => $position,
        ':termYear' => $termYear,  // store the string directly, walang FK lookup
        ':studentID' => $studentID,
    ]);

    echo json_encode(['success' => true, 'message' => 'Profile updated successfully.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>