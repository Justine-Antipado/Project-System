<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');

include_once 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
$data = $_POST;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($data)) {
    // data galing sa register form
    $schoolIDNo = trim($data['schoolIDNo'] ?? '');
    $email = trim($data['email'] ?? '');
    $lastName = trim($data['lastName'] ?? '');
    $firstName = trim($data['firstName'] ?? '');
    $middleName = !empty($data['middleName']) ? trim($data['middleName']) : null;
    $password = $data['password'] ?? '';

    $program = (empty($data['program']) || $data['program'] === 'Select Prog...') ? null : trim($data['program']);
    $section = (empty($data['section']) || $data['section'] === 'Select Sec...') ? null : trim($data['section']);
    $yearLevel = (isset($data['yearLevel']) && is_numeric($data['yearLevel'])) ? (int) $data['yearLevel'] : null;

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    try {

    

    $sql = 'INSERT INTO students (SchoolIDNo, Email, LastName, FirstName, MiddleName, Program, YearLevel, section, StudentQRCode, password) 
                    VALUES (:schoolIDNo, :email, :lastName, :firstName, :middleName, :program, :yearLevel, :section, :qrCode, :password)';

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':schoolIDNo' => $schoolIDNo,
        ':email' => $email,
        ':lastName' => $lastName,
        ':firstName' => $firstName,
        ':middleName' => $middleName,
        ':program' => $program,
        ':yearLevel' => $yearLevel,
        ':section' => $section,
        ':qrCode' => $generatedQRText,
        ':password' => $hashedPassword
    ]);

    //meron na nito sa ui ko yun nalang gamitin
http_response_code(201);
            echo json_encode(['message' => 'Registration successful!']);
            exit;
    } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Database processing failed: ' . $e->getMessage()]);
            exit;
        }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Bad Request. Empty payload.']);
}
?>