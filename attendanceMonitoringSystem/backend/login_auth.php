<?php
if (ob_get_level()) {
    ob_end_clean();
}

// I-allow ang frontend origin mo nang malinaw (Bawal ang '*' kapag may credentials)
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');  // CRITICAL: Para sa PHP session cookies

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simulan ang session bago mag-echo ng kahit ano
session_start();

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
    $stmt = $pdo->prepare('SELECT * FROM students WHERE SchoolIDNo = :schoolIDNo LIMIT 1');
    $stmt->execute([':schoolIDNo' => $schoolIDNo]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    $isPasswordValid = false;
    if ($user) {
        if (password_verify($password, $user['Password'])) {
            $isPasswordValid = true;
        } elseif ($user['Password'] === $password) {
            $isPasswordValid = true;
        }
    }

    if (!$user || !$isPasswordValid) {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(['message' => 'Invalid School ID or Password.']);
        exit();
    }

    // Tanggalin ang password para sa security bago i-save sa session [cite: 328]
    unset($user['Password']);

    // Dito natin ise-save ang user data sa PHP Session
    $_SESSION['studentUser'] = $user;

    header('Content-Type: application/json');
    http_response_code(200);
    echo json_encode([
        'message' => 'Login successful!',
        'user' => $user  // Pwede mo pa rin ibalik kung gusto mo gamitin sa React state
    ]);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(['message' => 'Database operation failed: ' . $e->getMessage()]);
}
?>