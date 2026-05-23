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

include_once 'connection.php';

// Siguraduhing POST request ang pumapasok
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Content-Type: application/json');
    http_response_code(405);
    echo json_encode(['message' => 'Method Not Allowed. Use POST.']);
    exit();
}

// Basahin ang data mula sa FormData ($_POST)
$schoolIDNo = isset($_POST['schoolIDNo']) ? trim($_POST['schoolIDNo']) : null;
$password = isset($_POST['password']) ? trim($_POST['password']) : null;

// Validation para sa mga kulang na field
if (empty($schoolIDNo) || empty($password)) {
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['message' => 'Both School ID and Password are required.']);
    exit();
}

try {
    // 1. Babasahin muna natin ang row. Kung anuman ang case format ng table mo (SchoolIDNo o schoolIDNo), 
    // siguraduhing tugma ito sa pangalan ng column mo sa phpMyAdmin!
    $stmt = $pdo->prepare("SELECT * FROM students WHERE SchoolIDNo = :schoolIDNo LIMIT 1");
    $stmt->execute([':schoolIDNo' => $schoolIDNo]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // 2. Pagpapasya kung Hashed o Plain Text ang Password:
    // Gumawa ng checker para gumana sa plain-text inputs AT sa encrypted security entries.
    $isPasswordValid = false;
    if ($user) {
        // Tinitingnan kung nakatago sa database gamit ang standard password_hash system format
        if (password_verify($password, $user['password'])) {
            $isPasswordValid = true;
        } 
        // fallback matching mechanism kung plain text pa ang nakasulat sa table record habang nagte-test
        elseif ($user['password'] === $password) {
            $isPasswordValid = true;
        }
    }

    // SECURE CHECK EVALUATION
    if (!$user || !$isPasswordValid) {
        header('Content-Type: application/json');
        http_response_code(401);
        echo json_encode(['message' => 'Invalid School ID or Password.']);
        exit();
    }

    // Tanggalin ang sensitibong impormasyon bago ibalik sa React application client space
    unset($user['password']);
    
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