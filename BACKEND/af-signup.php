<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';
$role = isset($_POST['role']) ? trim($_POST['role']) : '';
$dynamicSelect = isset($_POST['dynamicSelect']) ? trim($_POST['dynamicSelect']) : '';

// Basic validation
if (empty($name) || empty($email) || empty($phone) || empty($password) || empty($role) || empty($dynamicSelect)) {
    echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
    exit;
}

// Validate phone number (basic check for digits)
if (!preg_match('/^[0-9]{10}$/', $phone)) {
    echo json_encode(['status' => 'error', 'message' => 'Phone number must be 10 digits']);
    exit;
}

// TODO: Store in database
// For now, we'll just return success
echo json_encode([
    'status' => 'success',
    'message' => 'Registration successful! Please login with your credentials.',
    'name' => $name,
    'email' => $email,
    'role' => $role
]);
exit;
?>
