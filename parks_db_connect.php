<?php
//1)connect to server
define('PASSWORD','vagrant');
define('DB_USER','vagrant');
define('DB_NAME','parks_db');//use this db
define('DB_HOST','127.0.0.1');
$dbc = new PDO(
'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME,
DB_USER,
PASSWORD
);
$dbc ->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
