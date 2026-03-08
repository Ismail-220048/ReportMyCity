<?php
require 'config.php';

// Get POST data
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$password = $_POST['password'] ?? '';
$role = $_POST['role'] ?? '';
$category_or_district = $_POST['dynamicSelect'] ?? '';

// Simple validation
if(empty($name) || empty($email) || empty($password) || empty($role)){
    sendJSON(['status'=>'error','message'=>'All fields are required']);
}

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

// Determine which collection to use
if($role === 'admin'){
    $collection = $adminsCollection;
    $extraField = ['district'=>$category_or_district];
} elseif($role === 'officer'){
    $collection = $officersCollection;
    $extraField = ['category'=>$category_or_district];
} else {
    sendJSON(['status'=>'error','message'=>'Invalid role selected']);
}

// Check if email already exists
$exists = $collection->findOne(['email'=>$email]);
if($exists){
    sendJSON(['status'=>'error','message'=>'Email already registered']);
}

// Insert into DB
$insertResult = $collection->insertOne([
    'name'=>$name,
    'email'=>$email,
    'phone'=>$phone,
    'password'=>$hashedPassword,
    'role'=>$role
] + $extraField);

if($insertResult->getInsertedCount() === 1){
    sendJSON(['status'=>'success','message'=>'Signup successful']);
} else {
    sendJSON(['status'=>'error','message'=>'Failed to signup']);
}
?>