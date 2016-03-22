<?PHP
require_once 'parks_db_connect.php';
$dbc->exec('DROP TABLE IF EXISTS national_parks');
//create national_parks table columns
$sql = <<<QUERY
CREATE TABLE national_parks(
parks_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
description VARCHAR (1000) NOT NULL,
location VARCHAR(100) NOT NULL,
date_established DATE,
area_in_acres DOUBLE,
PRIMARY KEY(parks_id)

)

QUERY;
$dbc ->exec($sql);
