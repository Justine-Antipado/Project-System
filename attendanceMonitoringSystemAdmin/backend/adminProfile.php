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

$studentID = $_SESSION['adminUser']['StudentID'];

try {
    $stmt = $pdo->prepare('
        SELECT
            o.OfficersID,
            o.Position,
            o.TermYear,
            s.StudentID,
            s.SchoolIDNo,
            s.FirstName,
            s.LastName,
            s.MiddleName,
            s.Email,
            s.Program,
            s.YearLevel,
            s.section,
            org.OrgName
        FROM officers o
        INNER JOIN students s ON o.StudentID = s.StudentID
        LEFT JOIN organizations org ON o.OrgID = org.OrgID
        WHERE s.StudentID = :studentID
        LIMIT 1
    ');

    $stmt->execute([':studentID' => $studentID]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Profile not found.']);
        exit();
    }

    echo json_encode(['success' => true, 'user' => $user]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>