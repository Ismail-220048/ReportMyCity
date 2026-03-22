<?php
include '../config/db.php';
header('Content-Type: application/json');

$email = $_GET['email'] ?? '';

if (!$email) {
    echo json_encode(["error" => "Email required"]);
    exit;
}

$officer = $db->officer_details->findOne(['email' => $email]);

if (!$officer) {
    echo json_encode(["error" => "Officer not found"]);
    exit;
}

echo json_encode([
    "id" => (string)$officer['_id'],
    "name" => $officer['name'] ?? '',
    "email" => $officer['email'] ?? '',
    "department" => $officer['department'] ?? ''
]);
?>