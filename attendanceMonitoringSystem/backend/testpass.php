<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once 'connection.php';

$stmt = $pdo->prepare("SELECT SchoolIDNo, Password FROM students LIMIT 2");
$stmt->execute();
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "<pre>";
foreach ($users as $user) {
    echo "School ID: " . $user['SchoolIDNo'] . "\n";
    echo "Hash in DB: " . $user['Password'] . "\n";
    
    $testPassword = 'Ju57ine';
    
    $verified = password_verify($testPassword, $user['Password']);
    echo "password_verify result: " . ($verified ? 'MATCH ✓' : 'NO MATCH ✗') . "\n";
    echo "Hash valid format: " . (password_get_info($user['Password'])['algoName'] !== 'unknown' ? 'YES' : 'NO') . "\n";
    echo "---\n";
}
echo "</pre>";
?>