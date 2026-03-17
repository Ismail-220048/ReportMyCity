<?php
include '../config/db.php';
header('Content-Type: application/json');

$id = $_GET['id'] ?? '';

if (!$id) {
    echo json_encode(["error" => "ID required"]);
    exit;
}

$complaint = $db->complaints->findOne([
    '_id' => new MongoDB\BSON\ObjectId($id)
]);

if (!$complaint) {
    echo json_encode(["error" => "Not found"]);
    exit;
}

$result = [
    "id" => (string)$complaint['_id'],
    "complaintId" => $complaint['complaintId'] ?? '',
    "title" => $complaint['title'] ?? '',
    "description" => $complaint['description'] ?? '',
    "location" => $complaint['location'] ?? '',
    "status" => $complaint['status'] ?? 'New',
    "date" => $complaint['date'] ?? '',
    "image" => $complaint['image'] ?? ''
];

echo json_encode($result);
?>