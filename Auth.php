<?php


require_once '../../Input.php';


class Auth{

	//corect login
	public static $username = 'guest';

	public static $password = '$2y$10$SLjwBwdOVvnMgWxvTI4Gb.YVcmDlPTpQystHMO2Kfyi/DS8rgA0Fm';

	public static function attempt($username,$password) {

		$validPassword = password_verify($password,self::$password);//static

		$validUserName = (self::$username == $username);

		return ($validPassword && $validUserName);

	}
		
	public static function check(){

		return isset($_SESSION['logged_in_user']);

	} 
                               

	public static function user() {

		return self::$username;
		
	}

	public static function logout() {

		// clear $_SESSION array
    	session_unset();

    	// delete session data on the server and send the client a new cookie
    	session_regenerate_id(true);

	}



}





?>