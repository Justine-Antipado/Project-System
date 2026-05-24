<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header("Content-Type: application/json; charset=UTF-8");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once 'connection.php';

// Read JSON payload
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Student ID is required."
    ]);
    exit;
}

$id = $data['id'];

try {

    // DELETE query using PDO
    $stmt = $pdo->prepare("DELETE FROM students WHERE StudentID = :id");

    $stmt->execute([
        ':id' => $id
    ]);

    echo json_encode([
        "status" => "success",
        "message" => "Record removed successfully."
    ]);

} catch (PDOException $e) {

    echo json_encode([
        "status" => "error",
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>