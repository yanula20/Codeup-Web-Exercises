
<?php
session_start();

require_once '../../Auth.php';

//checking the session for the 'logge_in_user' key and making sure it has a value
//are they logged in?
if( ! isset($_SESSION['logged_in_user']) || $_SESSION['logged_in_user'] == ""){

    header("Location: login.php");

    die();

} else{

    $username = Auth::user();
}


?>

<!DOCTYPE html>
<html>
<head>
    <title>Post Exercise</title>
<style type="text/css">

body{

    background-color: yellow;
    font-family: "Comic Sans MS", cursive, sans-serif;
}


h1 {
    width: 600px;
    color: red;
    font-size: 60px;
    margin: 0 auto;
   
}

</style>
</head>
<body>

    <h1>AUTHORIZED!!</h1>
    <h3><?=$username;?></h3>
    <br>
    <a href="logout.php">Logout</a>

</body>
</html>
