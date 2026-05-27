<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if (ob_get_level()) {
    ob_end_clean();
}

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
    // 1. Parse Student Basic Info
    $schoolIDNo = trim($data['schoolIDNo'] ?? '');
    $email = trim($data['email'] ?? '');
    $lastName = trim($data['lastName'] ?? '');
    $firstName = trim($data['firstName'] ?? '');
    $middleName = !empty($data['middleName']) ? trim($data['middleName']) : null;
    $password = $data['password'] ?? '';

    $program = (empty($data['program']) || $data['program'] === 'Select Pro...') ? null : trim($data['program']);
    $section = (empty($data['section']) || $data['section'] === 'Select Sec...') ? null : trim($data['section']);
    $yearLevel = (isset($data['yearLevel']) && is_numeric($data['yearLevel'])) ? (int) $data['yearLevel'] : null;

    // 2. Parse Officer Specific Info
    $organizationName = trim($data['organization'] ?? '');
    $position = trim($data['position'] ?? '');
    $termYear = trim($data['term_year'] ?? '');

    // 3. Security Data Generation
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $generatedQRText = 'OMSC-' . $schoolIDNo . '-' . bin2hex(random_bytes(4));

    // 4. Resolve OrgID from organizations table
    $getOrg = $pdo->prepare('SELECT OrgID FROM organizations WHERE OrgName = :orgName');
    $getOrg->execute([':orgName' => $organizationName]);
    $org = $getOrg->fetch(PDO::FETCH_ASSOC);
    $orgID = $org ? $org['OrgID'] : null;

    if ($orgID === null) {
        http_response_code(400);
        echo json_encode(['message' => 'Organization not found: ' . $organizationName]);
        exit;
    }

    try {
        $pdo->beginTransaction();

        // STEP A: Insert into students table
        $studentSql = 'INSERT INTO students 
                        (SchoolIDNo, Email, LastName, FirstName, MiddleName, Program, YearLevel, Section, StudentQRCode, Password) 
                       VALUES 
                        (:schoolIDNo, :email, :lastName, :firstName, :middleName, :program, :yearLevel, :section, :qrCode, :password)';

        $studentStmt = $pdo->prepare($studentSql);
        $studentStmt->execute([
            ':schoolIDNo' => $schoolIDNo,
            ':email' => $email,
            ':lastName' => $lastName,
            ':firstName' => $firstName,
            ':middleName' => $middleName,
            ':program' => $program,
            ':yearLevel' => $yearLevel,
            ':section' => $section,
            ':qrCode' => $generatedQRText,
            ':password' => $hashedPassword,
        ]);

        // STEP B: Get the new StudentID
        // lastInsertId() works when StudentID is AUTO_INCREMENT.
        // If your students table uses SchoolIDNo as the PK instead,
        // swap this line to: $studentID = $schoolIDNo;
        $studentID = $pdo->lastInsertId();

        if (!$studentID) {
            // Fallback: fetch StudentID by SchoolIDNo
            $findIdStmt = $pdo->prepare('SELECT StudentID FROM students WHERE SchoolIDNo = :schoolIDNo');
            $findIdStmt->execute([':schoolIDNo' => $schoolIDNo]);
            $res = $findIdStmt->fetch(PDO::FETCH_ASSOC);
            $studentID = $res ? $res['StudentID'] : null;
        }

        if (!$studentID) {
            throw new Exception('Could not resolve StudentID after insert.');
        }

        // STEP C: Insert into officers table (if org + position are valid)
        $hasValidOrg = ($orgID !== null && $organizationName !== 'Select Org...');
        $hasValidPos = (!empty($position) && $position !== 'Select Pos...' && $position !== 'Select Position');

        if ($hasValidOrg && $hasValidPos) {
            $officerSql = 'INSERT INTO officers (StudentID, OrgID, Position, TermYear) 
                           VALUES (:studentID, :orgID, :position, :termYear)';

            $officerStmt = $pdo->prepare($officerSql);
            $officerStmt->execute([
                ':studentID' => $studentID,
                ':orgID' => $orgID,
                ':position' => $position,
                ':termYear' => ($termYear !== 'Select Ter...') ? $termYear : '',
            ]);
        }

        $pdo->commit();

        http_response_code(201);
        echo json_encode(['message' => 'Registration successful!']);
        exit;
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
        exit;
    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(['message' => 'Server error: ' . $e->getMessage()]);
        exit;
    }
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Bad Request. Empty payload.']);
}
?>