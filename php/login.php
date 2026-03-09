<?php

session_start();
include "db.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

$email = $_POST["email"];
$password = $_POST["password"];

// Find user
$stmt = $conn->prepare("SELECT id, name, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows == 1) {

$user = $result->fetch_assoc();

if (password_verify($password, $user["password"])) {

$_SESSION["user_id"] = $user["id"];
$_SESSION["user_name"] = $user["name"];

echo "Login successful";

// redirect example
// header("Location: dashboard.php");

} else {
echo "Invalid password";
}

} else {
echo "User not found";
}

$stmt->close();
$conn->close();

}

?>