<?php
// Set error handling to not display errors directly
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';
$role = isset($_POST['role']) ? trim($_POST['role']) : '';

// Validate input
if (empty($email) || empty($password) || empty($role)) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
    exit;
}

// Check if email ends with @civictrack.com
if (strpos($email, '@civictrack.com') === false) {
    echo json_encode(['status' => 'error', 'message' => 'Please use a civictrack.com email']);
    exit;
}

// Validate role
$validRoles = ['admin', 'officer'];
if (!in_array($role, $validRoles)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid role selected']);
    exit;
}

// Extract username from email (part before @)
$emailParts = explode('@', $email);
$username = $emailParts[0];

// Generate user ID
$userId = strtoupper($role[0]) . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

// Success response - Accept ANY civictrack.com email with ANY password
session_start();
$_SESSION['user_id'] = $userId;
$_SESSION['email'] = $email;
$_SESSION['role'] = $role;
$_SESSION['name'] = ucfirst($username);

echo json_encode([
    'status' => 'success',
    'message' => 'Login successful',
    'user_id' => $userId,
    'name' => ucfirst($username),
    'role' => $role
]);
exit;
?>

