<?php
include '../config/db.php';
header('Content-Type: application/json');

$officerId = $_GET['officer_id'] ?? null;

$query = [];
if ($officerId) {
    $query['assigned_to'] = $officerId;
}

$data = $db->complaints->find($query)->toArray();

$result = [];
foreach ($data as $doc) {
    $result[] = [
        "id" => (string)$doc['_id'],
        "complaintId" => $doc['complaintId'] ?? '',
        "title" => $doc['title'] ?? '',
        "location" => $doc['location'] ?? '',
        "status" => $doc['status'] ?? 'New',
        "date" => $doc['date'] ?? ''
    ];
}

echo json_encode($result);
?>