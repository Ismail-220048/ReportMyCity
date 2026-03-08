<?php
// BACKEND/verify_otp.php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($data['phone_number']) || !isset($data['otp'])){
    sendJSON(['success'=>false, 'error'=>'Phone or OTP missing']);
}

$phone = $data['phone_number'];
$otp = (int)$data['otp'];

$collection = $db->otps;
$record = $collection->findOne(['phone' => $phone]);

if(!$record) sendJSON(['success'=>false, 'error'=>'OTP not found']);

if($record['otp'] === $otp){
    // OTP verified, remove it
    $collection->deleteOne(['phone'=>$phone]);
    sendJSON(['success'=>true]);
} else {
    sendJSON(['success'=>false, 'error'=>'Invalid OTP']);
}
?>