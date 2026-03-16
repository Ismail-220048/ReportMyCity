<?php
// Simple test endpoint to verify system is working

header('Content-Type: application/json');

echo json_encode([
    'status' => 'ok',
    'message' => 'PHP Server is running correctly!',
    'php_version' => phpversion(),
    'server_time' => date('Y-m-d H:i:s'),
    'test' => 'SUCCESS'
]);
?>
