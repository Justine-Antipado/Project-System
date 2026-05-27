<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

include_once 'connection.php';

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Read JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Check if data exists
if (!$data) {
    echo json_encode([
        'status' => 'error',
        'message' => 'No JSON data received'
    ]);
    exit();
}

// Validate required fields
if (
    !isset($data['id']) ||
    !isset($data['schoolIdNo']) ||
    !isset($data['firstName']) ||
    !isset($data['lastName']) ||
    !isset($data['program']) ||
    !isset($data['yearLevel']) ||
    !isset($data['section'])
) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Incomplete parameters'
    ]);
    exit();
}

try {
    // SQL Query using named placeholders for PDO
    $sql = 'UPDATE students SET
                SchoolIDNo = :schoolIdNo,
                FirstName = :firstName,
                LastName = :lastName,
                MiddleName = :middleName,
                Program = :program,
                YearLevel = :yearLevel,
                Section = :section
            WHERE StudentID = :id';

    // Prepare statement using the $pdo instance from connection.php
    $stmt = $pdo->prepare($sql);

    // Bind parameters and execute
    $result = $stmt->execute([
        ':schoolIdNo' => $data['schoolIdNo'],
        ':firstName' => $data['firstName'],
        ':lastName' => $data['lastName'],
        ':middleName' => $data['middleName'] ?? '',
        ':program' => $data['program'],
        ':yearLevel' => intval($data['yearLevel']),
        ':section' => $data['section'],
        ':id' => $data['id']
    ]);

    echo json_encode([
        'status' => 'success',
        'message' => 'Student updated successfully'
    ]);
} catch (PDOException $e) {
    // If something goes wrong, return the exact database error message
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>