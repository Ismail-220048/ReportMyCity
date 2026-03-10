<?php

error_reporting(E_ALL);
ini_set('display_errors',1);

require 'config.php';

// read JSON
$data = json_decode(file_get_contents("php://input"),true);

if(!isset($data['email']) || !isset($data['password'])){
sendJSON([
"success"=>false,
"error"=>"Missing email or password"
]);
}

$email = $data['email'];
$password = $data['password'];

// find user
$user = $db->users->findOne([
"email"=>$email
]);

if(!$user){
sendJSON([
"success"=>false,
"error"=>"User not found"
]);
}

// verify password
if(!password_verify($password,$user['password'])){
sendJSON([
"success"=>false,
"error"=>"Incorrect password"
]);
}

// login success
sendJSON([
"success"=>true
]);

?>