<?php
// Clear any previous output buffers to avoid accidental whitespace sending headers early
if (ob_get_level()) ob_end_clean();

// Allow your frontend origin
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");

// Target the preflight OPTIONS request immediately before anything else loads
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- NOW you can include your database connection config ---
include_once 'connection.php';

$data = $_POST;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($data)) {
    
    $schoolIDNo   = trim($data['schoolIDNo'] ?? '');
    $email        = trim($data['email'] ?? '');
    $lastName     = trim($data['lastName'] ?? '');
    $firstName    = trim($data['firstName'] ?? '');
    $middleName   = !empty($data['middleName']) ? trim($data['middleName']) : null;
    $password     = $data['password'] ?? '';

    // Mas pinalakas na checking para sa mga dropdown placeholders
    $program   = (empty($data['program']) || $data['program'] === "Select Prog...") ? null : trim($data['program']);
    $section   = (empty($data['section']) || $data['section'] === "Select Sec...") ? null : trim($data['section']);
    
    // I-convert sa integer LAMANG kung numeric ang string, kung hindi ay gawing null
    $yearLevel = (isset($data['yearLevel']) && is_numeric($data['yearLevel'])) ? (int)$data['yearLevel'] : null;
    // Kilalanin kung LOGIN o REGISTER ang request
    $isLoginRequest = empty($email) && !empty($schoolIDNo) && !empty($password);

    if ($isLoginRequest) {
        // --- SYSTEM LOGIN ---
        try {
            $stmt = $pdo->prepare("SELECT * FROM students WHERE SchoolIDNo = ?");
            $stmt->execute([$schoolIDNo]);
            $student = $stmt->fetch();

            if (!$student) {
                http_response_code(400);
                echo json_encode(["field" => "schoolIDNo", "message" => "School ID not found."]);
                exit;
            }

            if (!password_verify($password, $student['password'])) {
                http_response_code(400);
                echo json_encode(["field" => "password", "message" => "Incorrect password."]);
                exit;
            }

            http_response_code(200);
            echo json_encode([
                "message" => "Login successful!",
                "student" => ["id" => $student['StudentID'], "name" => $student['FirstName']]
            ]);
            exit;

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Database error during login."]);
            exit;
        }
    } else {
        // --- SYSTEM REGISTRATION ---
        try {
            // I-secure at i-hash ang password
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            
            // Mas maganda kung itong md5 hash ang gamitin mo para sa QR text para secured
            $generatedQRText = md5($schoolIDNo . time());

            // Tiyakin na eksaktong magkatugma ang placeholders dito...
            $sql = "INSERT INTO students (SchoolIDNo, Email, LastName, FirstName, MiddleName, Program, YearLevel, section, StudentQRCode, password) 
                    VALUES (:schoolIDNo, :email, :lastName, :firstName, :middleName, :program, :yearLevel, :section, :qrCode, :password)";
            
            $stmt = $pdo->prepare($sql);
            
            // ...at dito sa loob ng execute array (Case-sensitive at may tamang colon syntax)
            $stmt->execute([
                ':schoolIDNo'  => $schoolIDNo,
                ':email'       => $email,
                ':lastName'    => $lastName,
                ':firstName'   => $firstName,
                ':middleName'  => $middleName,
                ':program'     => $program,
                ':yearLevel'   => $yearLevel,
                ':section'     => $section,
                ':qrCode'      => $generatedQRText,
                ':password'    => $hashedPassword
                
            ]);

            http_response_code(201);
            echo json_encode(["message" => "Registration successful!"]);
            exit;

        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["message" => "Database processing failed: " . $e->getMessage()]);
            exit;
        }
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Bad Request. Empty payload."]);
}
?>