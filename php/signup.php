<?php

include "db.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

$name = $_POST["name"];
$email = $_POST["email"];
$password = $_POST["password"];

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Check if email already exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo "Email already registered";
    exit();
}

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $hashedPassword);

if ($stmt->execute()) {
    echo "Account created successfully";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();

}

?>