<?php
include '../config/db.php';
header('Content-Type: application/json');

echo json_encode([
  'new' => $db->complaints->countDocuments(['status' => 'New']),
  'progress' => $db->complaints->countDocuments(['status' => 'In Progress']),
  'overdue' => $db->complaints->countDocuments(['status' => 'Overdue']),
  'resolved' => $db->complaints->countDocuments(['status' => 'Resolved'])
]);
?>