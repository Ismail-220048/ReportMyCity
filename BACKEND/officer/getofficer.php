<?php
include '../config/db.php';
header('Content-Type: application/json');

$email = $_GET['email'] ?? '';

if (!$email) {
    echo json_encode(["error" => "Email required"]);
    exit;
}

$officer = $db->officers->findOne(['email' => $email]);

if (!$officer) {
    echo json_encode(["error" => "Officer not found"]);
    exit;
}

// Convert _id to string and select relevant fields
$result = [
    "id" => (string)$officer['_id'],
    "name" => $officer['name'] ?? '',
    "email" => $officer['email'] ?? '',
    "department" => $officer['department'] ?? '',
];

echo json_encode($result);
?>