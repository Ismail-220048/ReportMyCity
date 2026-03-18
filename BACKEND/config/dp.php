<?php
require '../vendor/autoload.php';

try {
    $client = new MongoDB\Client("mongodb+srv://isk553411_db_user:XeiUYPGoESx1hUy4@reportmycity.41c9exw.mongodb.net/?retryWrites=true&w=majority");

    $db = $client->reportmycity;

} catch (Exception $e) {
    die(json_encode(["error" => "DB Connection Failed: " . $e->getMessage()]));
}
?>