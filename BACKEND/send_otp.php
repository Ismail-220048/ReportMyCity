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

    sendJSON([
        "success"=>false,
        "error"=>$e->getMessage()
    ]);

}