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

$oldPassword = $body['old'] ?? '';
$newPassword = $body['new'] ?? '';
$confirmPassword = $body['confirm'] ?? '';

// ── Server-side validation ──
if (!$oldPassword || !$newPassword || !$confirmPassword) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'All password fields are required.']);
    exit();
}

if ($newPassword !== $confirmPassword) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'New passwords do not match.']);
    exit();
}

// Mirror the same rules enforced on the frontend
$passErrors = [];
if (strlen($newPassword) < 8)
    $passErrors[] = '8+ characters';
if (!preg_match('/\d/', $newPassword))
    $passErrors[] = 'at least one number';
if (!preg_match('/[!@#$%^&*()\,.\?":{}|<>]/', $newPassword))
    $passErrors[] = 'at least one special character';
if (!preg_match('/[a-z]/', $newPassword) || !preg_match('/[A-Z]/', $newPassword))
    $passErrors[] = 'both upper and lowercase letters';

if ($passErrors) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Password must contain: ' . implode(', ', $passErrors) . '.']);
    exit();
}

try {
    // ── Fetch current hashed password ──
    // Adjust column name (Password / PasswordHash) to match your students table
    $stmt = $pdo->prepare('SELECT Password FROM students WHERE StudentID = :studentID LIMIT 1');
    $stmt->execute([':studentID' => $studentID]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Student record not found.']);
        exit();
    }

    // ── Verify old password ──
    // password_verify() works when passwords are stored with password_hash().
    // If your project stores plain-text or MD5 passwords, swap the check below:
    //   Plain-text : if ($oldPassword !== $row['Password'])
    //   MD5        : if (md5($oldPassword) !== $row['Password'])
    if (!password_verify($oldPassword, $row['Password'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Current password is incorrect.']);
        exit();
    }

    // ── Hash & save new password ──
    $hashedNew = password_hash($newPassword, PASSWORD_BCRYPT);

    $updateStmt = $pdo->prepare('UPDATE students SET Password = :password WHERE StudentID = :studentID');
    $updateStmt->execute([
        ':password' => $hashedNew,
        ':studentID' => $studentID,
    ]);

    echo json_encode(['success' => true, 'message' => 'Password changed successfully.']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>