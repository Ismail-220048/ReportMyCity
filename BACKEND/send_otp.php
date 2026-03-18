<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'config.php';

use Twilio\Rest\Client;

// read JSON request
$data = json_decode(file_get_contents("php://input"), true);

if(!$data){
    sendJSON([
        "success"=>false,
        "error"=>"No data received"
    ]);
}

if(!isset($data['phone_number'])){
    sendJSON([
        "success"=>false,
        "error"=>"Phone number missing"
    ]);
}

$phone = $data['phone_number'];

// generate OTP
$otp = rand(1000,9999);

// store in MongoDB
$collection = $db->otps;

$collection->updateOne(
    ["phone"=>$phone],
    [
        '$set'=>[
            "phone"=>$phone,
            "otp"=>$otp,
            "created_at"=>new MongoDB\BSON\UTCDateTime()
        ]
    ],
    ["upsert"=>true]
);

try{
    // Demo Mode Check
    if (empty(TWILIO_SID) || empty(TWILIO_AUTH_TOKEN) || TWILIO_SID === 'YOUR_TWILIO_SID') {
        // Log for debugging
        error_log("OTP Demo Mode Active: OTP for $phone is $otp");
        sendJSON([
            "success"=>true,
            "demo"=>true,
            "message"=>"Demo Mode: OTP is $otp (Check console/logs)"
        ]);
        exit; // Terminate script to bypass Twilio API call
    }

    $twilio = new Client(TWILIO_SID, TWILIO_AUTH_TOKEN);

    $twilio->messages->create(
        $phone,
        [
            "from"=>TWILIO_PHONE,
            "body"=>"Your OTP is $otp"
        ]
    );

    sendJSON([
        "success"=>true
    ]);

}catch(Exception $e){
    // If Twilio fails, fallback to demo mode for testing
    error_log("Twilio Error: " . $e->getMessage());
    sendJSON([
        "success"=>true,
        "demo"=>true,
        "otp_debug"=>$otp,
        "message"=>"Twilio failed, using Demo Mode. OTP is $otp"
    ]);
}