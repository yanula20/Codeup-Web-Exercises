<?php
define('PASSWORD','yanula20');
define('DB_USER','codeup');
define('DB_NAME','codeup_test_db');//use this db
define('DB_HOST','127.0.0.1');

require_once 'Model.php';
require_once 'User.php';
       
$user = new User();
$user->first_name = 'Don';
$user->last_name = 'Moore';
$user->email = 'email';
$user->password = 'password';

$user->save();

print_r($user);
User::find(1);
User::delete(1);








?>