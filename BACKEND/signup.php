<?php
// BACKEND/signup.php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

$required = ['first_name','last_name','phone_number','username','email','password'];
foreach($required as $field){
    if(empty($data[$field])){
        sendJSON(['success'=>false, 'error'=>"$field missing"]);
    }
}

$collection = $db->users;

// Check if phone or email already exists
if($collection->findOne(['phone_number'=>$data['phone_number']])){
    sendJSON(['success'=>false, 'error'=>'Phone already registered']);
}

if($collection->findOne(['email'=>$data['email']])){
    sendJSON(['success'=>false, 'error'=>'Email already registered']);
}

// Hash password
$data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
$data['created_at'] = new MongoDB\BSON\UTCDateTime();

// Insert into MongoDB
$collection->insertOne($data);

sendJSON(['success'=>true]);
?>