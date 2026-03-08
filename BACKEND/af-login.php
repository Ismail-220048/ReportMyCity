<?php
require __DIR__ . '/vendor/autoload.php'; // MongoDB library
require 'config.php'; // your existing config.php with MongoDB connection

header("Content-Type: application/json");

if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    echo json_encode(['status'=>'error','message'=>'Invalid request method']);
    exit;
}

// Get POST data
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$role = $_POST['role'] ?? '';

if(!$email || !$password || !$role){
    echo json_encode(['status'=>'error','message'=>'All fields are required']);
    exit;
}

// Determine collection based on role
$collectionName = ($role === 'admin') ? 'admins' : 'officers';
$collection = $db->$collectionName;

// Find user by email
$user = $collection->findOne(['email'=>$email]);

if(!$user){
    echo json_encode(['status'=>'error','message'=>'User not found']);
    exit;
}

// Verify password (assuming you used password_hash during signup)
if(!password_verify($password, $user['password'])){
    echo json_encode(['status'=>'error','message'=>'Invalid password']);
    exit;
}

// Login successful
echo json_encode([
    'status'=>'success',
    'message'=>'Login successful',
    'role'=>$role,
    'user_id'=> (string)$user['_id'],
    'name'=>$user['name']
]);
exit;