<?php
if (ob_get_level())
    ob_end_clean();
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once '/connection.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'ID is required.']);
    exit;
}

try {
    // CASCADE on semesters FK means semesters are deleted automatically
    $stmt = $pdo->prepare('DELETE FROM school_years WHERE YearID = ?');
    $stmt->execute([(int) $data['id']]);

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'status' => 'success',
            'message' => 'School Year and its Semesters deleted successfully.'
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No record found with that ID.']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>