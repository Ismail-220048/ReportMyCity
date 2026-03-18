<?php
include '../config/db.php';
header('Content-Type: application/json');

$officerId = $_GET['officer_id'] ?? '';

if (!$officerId) {
    echo json_encode([]);
    exit;
}

$complaints = $db->complaints->find(
    ['assigned_to' => $officerId],
    ['sort' => ['date' => -1]]
)->toArray();

$result = [];

foreach ($complaints as $c) {
    $result[] = [
        "id" => (string)$c['_id'],
        "title" => $c['title'] ?? '',
        "status" => $c['status'] ?? 'New',
        "location" => $c['location'] ?? '',
        "date" => $c['date'] ?? '',
        "priority" => $c['priority'] ?? 'normal'
    ];
}

echo json_encode($result);
?>