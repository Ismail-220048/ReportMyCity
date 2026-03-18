<?php

require 'database.php';

$title = $_POST['title'];
$name = $_POST['name'];
$email = $_POST['email'];
$category = $_POST['category'];
$description = $_POST['description'];

$collection = $db->complaints;

$result = $collection->insertOne([
"title" => $title,
"name" => $name,
"email" => $email,
"category" => $category,
"description" => $description,
"status" => "Pending",
"created_at" => date("Y-m-d H:i:s")
]);

echo "Complaint submitted successfully";

?>