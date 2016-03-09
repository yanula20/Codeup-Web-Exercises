<?php
//starts session or finds a session
//allows us to use $_SESSION superglobals later
session_start();

require_once 'functions.php';

var_dump($_POST);

//corect login
$username = 'terrible';

//corect login
$password = 'terry';



//checks for user input in html POST method
$attemptedUsername = inputHas('username')? inputGet('username') : '';

$attemptedPassword = inputHas('password') ? inputGet('password') : '';



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

<style type="text/css">

body{

    background-color: yellow;
    font-family: "Comic Sans MS", cursive, sans-serif;
}

</style>
</head>
<body>
    <form method="POST"  action="login.php">
        <label>Name</label>
        <input type="text" name="username"><br>
        <label>Password</label>
        <input type="password" name="password"><br>
        <input type="submit">
    </form>
</body>
</html>