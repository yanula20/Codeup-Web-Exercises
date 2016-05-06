<?php
define('PASSWORD','yanula20');
define('DB_USER','codeup');
define('DB_NAME','codeup_test_db');//use this db
define('DB_HOST','127.0.0.1');
require_once 'db_connect.php';

$dbc->exec('DROP TABLE IF EXISTS user');
//create national_parks table columns
$sql = <<<QUERY
CREATE TABLE user(
id INT UNSIGNED NOT NULL AUTO_INCREMENT,
first_name VARCHAR(100) NOT NULL,
last_name VARCHAR (100) NOT NULL,
email VARCHAR(100) NOT NULL,
password VARCHAR(100) NOT NULL,
PRIMARY KEY(id)

)

QUERY;
$dbc->exec($sql);