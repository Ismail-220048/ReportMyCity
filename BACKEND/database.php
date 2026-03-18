<?php

require 'vendor/autoload.php';

$client = new MongoDB\Client("mongodb+srv://isk553411_db_user:XeiUYPGoESx1hUy4@reportmycity.41c9exw.mongodb.net/?appName=ReportMycity");

$db = $client->civictrack;

?>