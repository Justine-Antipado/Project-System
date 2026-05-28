<?php
if (ob_get_level())
    ob_end_clean();

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();  // ← MUST be before any output

include_once 'connection.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json');
    http_response_code(405);
    echo json_encode(['message' => 'Method Not Allowed. Use POST.']);
    exit();
}

$schoolIDNo = isset($_POST['schoolIDNo']) ? trim($_POST['schoolIDNo']) : null;
$password = isset($_POST['password']) ? trim($_POST['password']) : null;

if (empty($schoolIDNo) || empty($password)) {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['message' => 'Both School ID and Password are required.']);
    exit();
}

try {
    $stmt = $pdo->prepare('
    SELECT 
        students.StudentID,
        students.SchoolIDNo,
        students.Email,
        students.FirstName,
        students.LastName,
        students.Password,
        students.Program,
        students.YearLevel,
        students.section,
        officers.Position,
        officers.OrgID
    FROM students
    INNER JOIN officers ON students.StudentID = officers.StudentID
    WHERE students.SchoolIDNo = :schoolIDNo
    LIMIT 1
');
    $stmt->execute([':schoolIDNo' => $schoolIDNo]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(['message' => 'Access denied. Student is not an officer.']);
        exit();
    }

    $isPasswordValid = false;
    if (password_verify($password, $user['Password'])) {
        $isPasswordValid = true;
    } elseif ($user['Password'] === $password) {
        $isPasswordValid = true;
    }

    if (!$isPasswordValid) {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(['message' => 'Invalid School ID or Password.']);
        exit();
    }

    unset($user['Password']);

    // ── SAVE TO SESSION ──  ← THIS WAS MISSING
    $_SESSION['adminUser'] = $user;

    header('Content-Type: application/json');
    http_response_code(200);
    echo json_encode([
        'message' => 'Login successful!',
        'user' => $user
    ]);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['message' => 'Database operation failed: ' . $e->getMessage()]);
}
?>