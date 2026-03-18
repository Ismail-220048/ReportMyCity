<?php
include '../config/db.php';
header('Content-Type: application/json');

// Get officer ID safely
$officerId = $_GET['officer_id'] ?? '';
if (!$officerId) {
    echo json_encode(["error" => "Officer ID required"]);
    exit;
}

// 1️⃣ STATUS COUNT (frontend-friendly)
$statusStats = [
    "New" => 0,
    "In Progress" => 0,
    "Resolved" => 0,
    "Overdue" => 0
];

// 2️⃣ CATEGORY COUNT
$categoryStats = [];

// 3️⃣ TREND (last 7 days)
$trend = [];
$dates = [];

// Generate last 7 days dates (always show 0 if no complaints)
for ($i = 6; $i >= 0; $i--) {
    $d = date('Y-m-d', strtotime("-$i days"));
    $dates[] = $d;
    $trend[$d] = 0;
}

// Fetch complaints assigned to officer
$complaints = $db->complaints->find(['assigned_to' => $officerId])->toArray();

foreach ($complaints as $c) {

    // STATUS
    $status = $c['status'] ?? 'New';
    if (isset($statusStats[$status])) {
        $statusStats[$status]++;
    }

    // CATEGORY
    $category = $c['category'] ?? 'Other';
    if (!isset($categoryStats[$category])) $categoryStats[$category] = 0;
    $categoryStats[$category]++;

    // TREND (only last 7 days)
    if (!empty($c['date'])) {
        $date = date('Y-m-d', strtotime($c['date']));
        if (isset($trend[$date])) {
            $trend[$date]++;
        }
    }
}

// Convert trend to array
$trendArray = [];
foreach ($dates as $d) {
    $trendArray[] = ["date" => $d, "count" => $trend[$d]];
}

// Return JSON
echo json_encode([
    "statusStats" => $statusStats,
    "categoryStats" => $categoryStats,
    "trend" => $trendArray
]);
?>