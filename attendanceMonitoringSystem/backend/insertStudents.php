<?php 
include 'cennection.php';

// 1. I-map ang variables mula sa decoded data ng React body mo
$schoolIDNo    = trim($data['schoolIDNo'] ?? '');
$lastName      = trim($data['lastName'] ?? '');
$firstName     = trim($data['firstName'] ?? '');
$middleName    = trim($data['middleName'] ?? null); // Naka-null para tanggapin ng DB kung walang laman
$program       = trim($data['program'] ?? '');
$yearLevel     = trim($data['yearLevel'] ?? '');
$section       = trim($data['section'] ?? '');
$plainPassword = trim($data['password'] ?? '');

// 2. Mag-generate ng data para sa StudentQRCode (Halimbawa: unique hash base sa ID)
$studentQRCode = "OMSC-" . $schoolIDNo . "-" . bin2hex(random_bytes(4));

// 3. I-secure at i-hash ang password gamit ang Bcrypt
$hashedPassword = password_hash($plainPassword, PASSWORD_DEFAULT);

// 4. Ang PDO Prepare at Execute Block para sa Table
try {
    $sql = "INSERT INTO students (
                SchoolIDNo, 
                LastName, 
                FirstName, 
                MiddleName, 
                Program, 
                YearLevel, 
                Section, 
                StudentQRCode, 
                password
            ) VALUES (
                :schoolIDNo, 
                :lastName, 
                :firstName, 
                :middleName, 
                :program, 
                :yearLevel, 
                :section, 
                :studentQRCode, 
                :password
            )";

    $stmt = $conn->prepare($sql);

    $stmt->execute([
        ':schoolIDNo'   => $schoolIDNo,
        ':lastName'     => $lastName,
        ':firstName'    => $firstName,
        ':middleName'   => $middleName, // I-e-enter nito ay NULL sa SQL kapag walang value
        ':program'      => $program,
        ':yearLevel'    => $yearLevel,
        ':section'      => $section,
        ':studentQRCode'=> $studentQRCode,
        ':password'     => $hashedPassword
    ]);

    // Ibalik sa React na okay ang insertion
    echo json_encode(["status" => "success", "message" => "Student registered successfully!"]);

} catch (PDOException $e) {
    // Sakaling may SQL/Database error (Halimbawa: duplicate Entry sa SchoolIDNo)
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>