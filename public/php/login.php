<?php


//starts session or finds a session
//allows us to use $_SESSION superglobals later
session_start();

require_once '../../Input.php';

require_once '../../Auth.php';

require_once '../../Log.php';

var_dump($_POST);


//corect login
$username = 'guest';
$password = 'password';



//checks for user input in html POST method
$attemptedUsername = Input::has('username')? Input::get('username') : '';

$attemptedPassword = Input::has('password') ? Input::get('password') : '';



//checking if 'logged_in_user'
if(Auth::check()){

	header("Location: authorized.php");

	die();


//first time logged in
}elseif(Auth::attempt($attemptedUsername,$attemptedPassword)){

	$_SESSION['logged_in_user'] = $username;//session key for the username

    $successUserLog = new Log('success-');

    $successUserLog->logInfo("User login successful.");
	
	header("Location: authorized.php");

	die();//must prevent code from running below after user has gone to authorized page!!

//  Checking to see if entered wrong info
} elseif  ($attemptedUsername != '' || $attemptedPassword != ''){

    $failedUserLog = new Log('failed-');

    $failedUserLog->logError("User login NOT successful.");

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