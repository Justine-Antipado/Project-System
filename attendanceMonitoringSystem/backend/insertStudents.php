<?php
// ─────────────────────────────────────────────
//  register.php  –  Student Registration API
//  Expects a POST request with JSON body
// ─────────────────────────────────────────────
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// ── 0. Handle preflight (CORS) ───────────────
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ── 1. Only allow POST ───────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed. Use POST.']);
    exit();
}

// ── 2. Parse JSON body ───────────────────────
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON body.']);
    exit();
}

// ── 3. DB Connection ─────────────────────────
include 'connection.php'; // $conn must be a mysqli object

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit();
}

// ── 4. Collect & Sanitize Inputs ─────────────
$schoolIDNo  = trim($data['schoolIDNo']  ?? '');
$email       = trim($data['email']       ?? '');
$lastName    = trim($data['lastName']    ?? '');
$firstName   = trim($data['firstName']  ?? '');
$middleName  = trim($data['middleName']  ?? '');
$program     = trim($data['program']    ?? '');
$yearLevel   = intval($data['yearLevel'] ?? 0);
$section     = trim($data['section']    ?? '');
$password    = $data['password']         ?? '';
$confirmPass = $data['confirmPassword']  ?? '';

// ── 5. Server-Side Validation ─────────────────
$errors = [];

if (empty($schoolIDNo))                         $errors['schoolIDNo']      = 'School ID is required.';
if (empty($email))                              $errors['email']           = 'Email is required.';
elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email']       = 'Invalid email format.';
if (empty($lastName))                           $errors['lastName']        = 'Last Name is required.';
if (empty($firstName))                          $errors['firstName']       = 'First Name is required.';
if (empty($program) || $program === 'Select Pro...') $errors['program']   = 'Please select a Program.';
if ($yearLevel < 1 || $yearLevel > 4)           $errors['yearLevel']      = 'Please select a valid Year Level.';
if (empty($section) || $section === 'Select Sec...') $errors['section']   = 'Please select a Section.';

// Password requirement checks (mirrors the React front-end)
if (empty($password)) {
    $errors['password'] = 'Password is required.';
} else {
    $passErrors = [];
    if (strlen($password) < 8)                          $passErrors[] = 'at least 8 characters';
    if (!preg_match('/\d/', $password))                 $passErrors[] = 'a number';
    if (!preg_match('/[!@#$%^&*()\,.?":{}|<>]/', $password)) $passErrors[] = 'a special character';
    if (!preg_match('/[a-z]/', $password) || !preg_match('/[A-Z]/', $password)) $passErrors[] = 'uppercase & lowercase letters';

    if (!empty($passErrors))
        $errors['password'] = 'Password must contain: ' . implode(', ', $passErrors) . '.';
}

if ($password !== $confirmPass)
    $errors['confirmPassword'] = 'Passwords do not match.';

// ── 6. Duplicate Checks (only if base validation passed) ──
if (empty($errors['schoolIDNo'])) {
    $stmt = $conn->prepare('SELECT StudentID FROM students WHERE SchoolIDNo = ? LIMIT 1');
    $stmt->bind_param('s', $schoolIDNo);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0)
        $errors['schoolIDNo'] = 'School ID is already registered.';
    $stmt->close();
}

if (empty($errors['email'])) {
    // NOTE: If your `students` table has no `email` column yet, add it:
    //   ALTER TABLE students ADD COLUMN Email varchar(150) UNIQUE;
    $stmt = $conn->prepare('SELECT StudentID FROM students WHERE Email = ? LIMIT 1');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0)
        $errors['email'] = 'Email address is already in use.';
    $stmt->close();
}

// ── 7. Return errors if any ───────────────────
if (!empty($errors)) {
    http_response_code(422); // Unprocessable Entity
    echo json_encode([
        'success' => false,
        'message' => 'Validation failed.',
        'errors'  => $errors,
    ]);
    $conn->close();
    exit();
}

// ── 8. Hash password & Generate QR payload ───
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Simple QR payload – you can replace this with a real QR library (e.g. phpqrcode)
$qrPayload = base64_encode(json_encode([
    'schoolIDNo' => $schoolIDNo,
    'name'       => "$firstName $lastName",
    'program'    => $program,
    'year'       => $yearLevel,
    'section'    => $section,
]));

// ── 9. Insert into database ───────────────────
$sql = '
    INSERT INTO students
        (SchoolIDNo, Email, LastName, FirstName, MiddleName, Program, YearLevel, section, StudentQRCode, password)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
';

$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
    $conn->close();
    exit();
}

$stmt->bind_param(
    'ssssssisis',
    $schoolIDNo,
    $email,
    $lastName,
    $firstName,
    $middleName,
    $program,
    $yearLevel,
    $section,
    $qrPayload,
    $hashedPassword
);

if ($stmt->execute()) {
    http_response_code(201); // Created
    echo json_encode([
        'success'   => true,
        'message'   => 'Registration successful! You can now sign in.',
        'studentId' => $stmt->insert_id,
    ]);
} else {
    // Catch any DB-level duplicate/constraint errors as a safety net
    $errCode = $conn->errno;
    $errMsg  = $conn->error;

    if ($errCode === 1062) { // Duplicate entry
        http_response_code(409);
        echo json_encode([
            'success' => false,
            'message' => 'Duplicate entry detected.',
            'errors'  => ['db' => $errMsg],
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Registration failed: ' . $errMsg,
        ]);
    }
}

$stmt->close();
$conn->close();