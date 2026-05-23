<?php
if (ob_get_level()) ob_end_clean();

// I-allow ang iyong React frontend origin
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once 'connection.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // SchoolIDNo at Email lamang ang kukunin para mabilis ang loading
        // Gumamit tayo ng AS para maging lowercase na ang keys pagdating sa React
        $sql = "SELECT SchoolIDNo AS schoolIDNo, Email AS email FROM students";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        
        $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode($students);
        exit();

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to fetch validation data: " . $e->getMessage()]);
        exit();
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
}
?>