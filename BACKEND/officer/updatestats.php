<?php
include '../config/db.php';
header('Content-Type: application/json');

$id = $_POST['id'] ?? '';
$status = $_POST['status'] ?? '';

$validStatuses = ['New', 'In Progress', 'Resolved', 'Overdue'];

if (!$id || !in_array($status, $validStatuses)) {
    echo json_encode(["error" => "Invalid data"]);
    exit;
}

$db->complaints->updateOne(
    ['_id' => new MongoDB\BSON\ObjectId($id)],
    ['$set' => ['status' => $status]]
);

echo json_encode(["message" => "Updated"]);
?>