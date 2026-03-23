<?php

require 'vendor/autoload.php';

$uri = "mongodb+srv://isk553411_db_user:XeiUYPGoESx1hUy4@reportmycity.41c9exw.mongodb.net/?retryWrites=true&w=majority";

try {

    $client = new MongoDB\Client($uri);

    // Database
    $db = $client->CivicTrack;

} catch (Exception $e) {

    die("Database Connection Error: " . $e->getMessage());

}

?>