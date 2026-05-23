<?php
if (ob_get_level())
    ob_end_clean();

header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Credentials: true');

include_once 'connection.php';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $schoolIDNo = isset($_POST['schoolIDNo']) ? trim($_POST['schoolIDNo']) : '';
    $password = isset($_POST['password']) ? $_POST['password'] : '';

    if (empty($schoolIDNo) || empty($password)) {
        echo json_encode(["success" => false, "message" => "Please fill in all fields."]);
        exit;
    }

    // Hanapin ang user gamit ang School ID
    $query = "SELECT * FROM students WHERE SchoolIDNo = ? LIMIT 1";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $schoolIDNo);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // I-verify kung tama ang plaintext password sa database hash string
        if (password_verify($password, $user['password'])) {
            
            // Tanggalin ang password field bago ibalik sa React para sa privacy/security
            unset($user['password']);

            echo json_encode([
                "success" => true,
                "message" => "Login successful.",
                "user" => $user
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Incorrect password."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "School ID number not found."]);
    }
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>