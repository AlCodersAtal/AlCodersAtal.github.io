<?php
// Connect to the database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "login"; // Replace with your database name

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Registration process
if (isset($_POST['signUp'])) {
  $firstName = $_POST['fName'];
  $lastName = $_POST['lName'];
  $email = $_POST['email'];
  $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

  $sql = "INSERT INTO users (first_name, last_name, email, password) VALUES ('$firstName', '$lastName', '$email', '$password')";

  if ($conn->query($sql) === TRUE) {
    echo "Registration successful!";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
}

// Login process
if (isset($_POST['signIn'])) {
  $email = $_POST['email'];
  $password = $_POST['password'];

  $sql = "SELECT * FROM users WHERE email = '$email'";
  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['password'])) {
      echo "Login successful!";
      // Redirect or start session as needed
    } else {
      echo "Incorrect password!";
    }
  } else {
    echo "No user found with that email!";
  }
}

$conn->close();
