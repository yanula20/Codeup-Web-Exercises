<?php
//starts session or finds a session
//allows us to use $_SESSION superglobals later
session_start();

include_once 'functions.php';

var_dump($_POST);

//corect login
$username = 'guest';

//corect login
$password = 'password';



//checks for user input in html POST method
$attemptedUsername = isset($_POST['username']) ? $_POST['username'] : '';

$attemptedPassword = isset($_POST['password']) ? $_POST['password'] : '';



//checking if 'logged_in_user'
if(isset($_SESSION['logged_in_user']) && $_SESSION['logged_in_user'] != ""){

	header("Location: authorized.php");

	die();


//first time logged in
}elseif($attemptedPassword == $password && $attemptedUsername == $username){

	$_SESSION['logged_in_user'] = $username;//session key for the username
	
	header("Location: authorized.php");

	die();//must prevent code from running below after user has gone to authorized page!!

//  Checking to see if entered wrong info
} elseif  ($attemptedUsername != '' || $attemptedPassword != ''){

	echo 'You have not successfully logged in!';
}

?>

<!DOCTYPE html>
<html>
<head>
    <title>POST Example</title>
</head>
<body>
    <form method="POST"  action="login.php">
        <label>Name</label>
        <input type="text" name="username"><br>
        <label>Password</label>
        <input type="passwoerd" name="password"><br>
        <input type="submit">
    </form>
</body>
</html>