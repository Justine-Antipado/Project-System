<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
include_once 'connection.php';

if (!isset($_SESSION['studentUser'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized.']);
    exit();
}

$studentID = $_SESSION['studentUser']['StudentID'];
$oldPassword = isset($_POST['oldPassword']) ? trim($_POST['oldPassword']) : null;
$newPassword = isset($_POST['newPassword']) ? trim($_POST['newPassword']) : null;

if (!$oldPassword || !$newPassword) {
    http_response_code(400);
    echo json_encode(['message' => 'Both old and new passwords are required.']);
    exit();
}

try {
    // Fetch current hashed password
    $stmt = $pdo->prepare('SELECT Password FROM students WHERE StudentID = :studentID LIMIT 1');
    $stmt->execute([':studentID' => $studentID]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        http_response_code(404);
        echo json_encode(['message' => 'Student not found.']);
        exit();
    }

    // Verify old password (supports both hashed and plain for legacy)
    $isValid = password_verify($oldPassword, $row['Password']) || $row['Password'] === $oldPassword;

    if (!$isValid) {
        http_response_code(401);
        echo json_encode(['message' => 'Current password is incorrect.']);
        exit();
    }

    // Hash new password and update
    $hashedNew = password_hash($newPassword, PASSWORD_BCRYPT);
    $update = $pdo->prepare('UPDATE students SET Password = :password WHERE StudentID = :studentID');
    $update->execute([':password' => $hashedNew, ':studentID' => $studentID]);

    echo json_encode(['success' => true, 'message' => 'Password changed successfully!']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'DB error: ' . $e->getMessage()]);
}
?>