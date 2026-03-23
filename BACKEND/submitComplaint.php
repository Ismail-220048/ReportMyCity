<?php

require 'database.php';

if($_SERVER["REQUEST_METHOD"] == "POST"){

$title = $_POST['title'];
$name = $_POST['name'];
$email = $_POST['email'];
$category = $_POST['category'];
$priority = $_POST['priority'];
$description = $_POST['description'];
$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];

$imagePath = "";

/* IMAGE UPLOAD */

if(isset($_FILES['image']) && $_FILES['image']['error']==0){

$uploadDir = "uploads/";
$imageName = time() . "_" . basename($_FILES["image"]["name"]);

$imagePath = $uploadDir . $imageName;

move_uploaded_file($_FILES["image"]["tmp_name"], $imagePath);

}

/* INSERT INTO DATABASE */

$collection = $db->complaints;

$collection->insertOne([

"title"=>$title,
"name"=>$name,
"email"=>$email,
"category"=>$category,
"priority"=>$priority,
"description"=>$description,
"latitude"=>$latitude,
"longitude"=>$longitude,
"image"=>$imagePath,
"status"=>"Pending",
"created_at"=>date("Y-m-d H:i:s")

]);

header("Location: ../frontend/user-dashboard/dashboard.html?success=1");

exit();

}

?>