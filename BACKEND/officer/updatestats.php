<?php
include '../config/db.php';
header('Content-Type: application/json');

$id = $_POST['id'] ?? '';
$status = $_POST['status'] ?? '';

if (!$id || !$status) {
    echo json_encode(["error" => "Missing data"]);
    exit;
}

// Ensure status is valid
$validStatuses = ['New', 'In Progress', 'Resolved', 'Overdue'];
if (!in_array($status, $validStatuses)) {
    echo json_encode(["error" => "Invalid status"]);
    exit;
}

$db->complaints->updateOne(
    ['_id' => new MongoDB\BSON\ObjectId($id)],
    ['$set' => ['status' => $status]]
);

echo json_encode(["message" => "Status updated"]);
?>