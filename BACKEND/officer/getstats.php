<?php
include '../config/db.php';

$new = $db->complaints->countDocuments(['status' => 'pending']);
$progress = $db->complaints->countDocuments(['status' => 'in-progress']);
$overdue = $db->complaints->countDocuments(['status' => 'overdue']);
$resolved = $db->complaints->countDocuments(['status' => 'resolved']);

echo json_encode([
  'new' => $new,
  'progress' => $progress,
  'overdue' => $overdue,
  'resolved' => $resolved
]);
?>