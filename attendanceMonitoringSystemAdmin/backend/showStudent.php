<?php
// Clear any accidental output buffers (prevents HTML whitespaces from corrupting JSON)
if (ob_get_level()) {
    ob_end_clean();
}

// 1. Setup CORS Headers for your local React Vite Dev Server
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=UTF-8');

// Handle preflight OPTIONS requests early
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
session_start();
// 2. Include your database connection setup
include_once 'connection.php';

// Only allow GET requests for retrieving data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Query matches your exact phpMyAdmin columns:
        // StudentID, SchoolIDNo, Email, LastName, FirstName, MiddleName, Program, YearLevel, section, StudentQRCode
        $sql = 'SELECT 
                    StudentID, 
                    SchoolIDNo, 
                    Email, 
                    LastName, 
                    FirstName, 
                    MiddleName, 
                    Program, 
                    YearLevel, 
                    section, 
                    StudentQRCode 
                FROM students 
                ORDER BY StudentID DESC';

        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        // Fetch rows into an associative array
        $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Respond with a 200 OK code and dispatch the formatted rows
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'count' => count($students),
            'data' => $students
        ]);
        exit;
    } catch (PDOException $e) {
        // Safe database fallback message
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to retrieve structural student profiles.',
            'error' => $e->getMessage()
        ]);
        exit;
    }
} else {
    // If someone sends a POST, PUT, or DELETE request to this endpoint
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method Not Allowed. Use GET requests.'
    ]);
    exit;
}
?>