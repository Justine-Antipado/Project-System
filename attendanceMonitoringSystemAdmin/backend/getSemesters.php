<?php
// getSemesters.php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');
header("Content-Type: application/json");

require_once 'connection.php';

$sql = "
    SELECT
        s.SemesterID,
        s.SemesterName,
        sy.YearRange
    FROM semesters s
    JOIN school_years sy ON s.YearID = sy.YearID
    ORDER BY sy.YearRange ASC, s.SemesterName ASC
";

$result = $conn->query($sql);

if (!$result) {
    http_response_code(500);
    echo json_encode(["error" => $conn->error]);
    exit;
}

$semesters = [];
while ($row = $result->fetch_assoc()) {
    $semesters[] = $row;
}

echo json_encode($semesters);
$conn->close();
?>