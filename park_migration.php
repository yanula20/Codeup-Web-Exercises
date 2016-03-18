<?PHP
define('PASSWORD','vagrant');
define('DB_USER','vagrant');
define('DB_NAME','parks_db');//use this db
define('DB_HOST','127.0.0.1');
require_once 'parks_db_connect.php';
$dbc->exec('DROP TABLE IF EXISTS national_parks');
//create national_parks table columns
$sql = <<<QUERY
CREATE TABLE national_parks(
parks_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
location VARCHAR(100) NOT NULL,
date_established DATE,
area_in_acres DOUBLE,
PRIMARY KEY(parks_id)

)

QUERY;
$dbc ->exec($sql);
