<?php
require __DIR__ . '/vendor/autoload.php';

use Twilio\Rest\Client;

// ==========================
// Twilio Credentials
// ==========================
define('TWILIO_SID', '');
define('TWILIO_AUTH_TOKEN', '');
define('TWILIO_PHONE', '');

// ==========================
// MongoDB Connection
// ==========================
$mongoClient = new MongoDB\Client("mongodb://127.0.0.1:27017");
$db = $mongoClient->civictrack;

// Existing user collection (for general users)
$usersCollection = $db->users;

// ==========================
// New Collections
// ==========================
// Admins collection
$adminsCollection = $db->admins;

// Officers collection
$officersCollection = $db->officers;

// ==========================
// Helper function
// ==========================
function sendJSON($arr){
    header("Content-Type: application/json");
    echo json_encode($arr);
    exit;
}