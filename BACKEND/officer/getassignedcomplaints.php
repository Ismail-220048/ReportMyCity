<?php
include '../config/db.php';
header('Content-Type: application/json');

$officerId = $_GET['officer_id'] ?? '';

if (!$officerId) {
    echo json_encode([]);
    exit;
}

$data = $db->complaints->find([
    'assigned_to' => $officerId
])->toArray();

$result = [];

foreach ($data as $doc) {
    $result[] = [
        "id" => (string)$doc['_id'],
        "complaintId" => $doc['complaintId'] ?? '',
        "title" => $doc['title'] ?? '',
        "location" => $doc['location'] ?? '',
        "status" => $doc['status'] ?? 'New',
        "date" => $doc['date'] ?? '',
        "lat" => $doc['lat'] ?? null,
        "lng" => $doc['lng'] ?? null,
    ];
}

echo json_encode($result);
?>