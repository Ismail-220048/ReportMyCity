<?php
include '../config/db.php';
header('Content-Type: application/json');

$officerId = $_GET['officer_id'] ?? '';

if (!$officerId) {
    echo json_encode(["error" => "Officer ID required"]);
    exit;
}

$statusStats = [
    "New" => 0,
    "In Progress" => 0,
    "Resolved" => 0,
    "Overdue" => 0
];

$categoryStats = [];
$trend = [];
$dates = [];

for ($i = 6; $i >= 0; $i--) {
    $d = date('Y-m-d', strtotime("-$i days"));
    $dates[] = $d;
    $trend[$d] = 0;
}

$complaints = $db->complaints->find(['assigned_to' => $officerId])->toArray();

foreach ($complaints as $c) {

    $status = $c['status'] ?? 'New';
    if (isset($statusStats[$status])) {
        $statusStats[$status]++;
    }

    $category = $c['category'] ?? 'Other';
    $categoryStats[$category] = ($categoryStats[$category] ?? 0) + 1;

    if (!empty($c['date'])) {
        $date = date('Y-m-d', strtotime($c['date']));
        if (isset($trend[$date])) {
            $trend[$date]++;
        }
    }
}

$trendArray = [];
foreach ($dates as $d) {
    $trendArray[] = ["date" => $d, "count" => $trend[$d]];
}

echo json_encode([
    "statusStats" => $statusStats,
    "categoryStats" => $categoryStats,
    "trend" => $trendArray
]);
?>