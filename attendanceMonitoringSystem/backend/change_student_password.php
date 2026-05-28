<?php
if (ob_get_level()) {
    ob_end_clean();
}

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
include_once 'connection.php';

header('Content-Type: application/json');

if (!isset($_SESSION['studentUser'])) {
    http_response_code(401);

    echo json_encode([
        'success' => false,
        'message' => 'Unauthorized'
    ]);

    exit();
}

try {
    $studentID = $_SESSION['studentUser']['StudentID'];

    $oldPassword = trim($_POST['oldPassword']);
    $newPassword = trim($_POST['newPassword']);

    $stmt = $pdo->prepare('SELECT Password FROM students WHERE StudentID = :studentID');
    $stmt->execute([':studentID' => $studentID]);

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            'success' => false,
            'message' => 'User not found'
        ]);
        exit();
    }

    $isValid = false;

    if (password_verify($oldPassword, $user['Password'])) {
        $isValid = true;
    } elseif ($oldPassword === $user['Password']) {
        $isValid = true;
    }

    if (!$isValid) {
        echo json_encode([
            'success' => false,
            'message' => 'Current password is incorrect'
        ]);
        exit();
    }

    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    $updateStmt = $pdo->prepare('
        UPDATE students 
        SET Password = :password
        WHERE StudentID = :studentID
    ');

    $updateStmt->execute([
        ':password' => $hashedPassword,
        ':studentID' => $studentID
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Password changed successfully'
    ]);
} catch (PDOException $e) {
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>