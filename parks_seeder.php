<?php
define('PASSWORD','vagrant');
define('DB_USER','vagrant');
define('DB_NAME','parks_db');//use this db, see parks seeder define constants before require or connect won't occur below
define('DB_HOST','127.0.0.1');
require_once 'parks_db_connect.php';

$parksArray = [
	['name'=>'Acadia','location'=>'Maine','date_established'=>'1919-02-026','area_in_acres'=>47389.67],
	['name'=>'American Somoa','location'=>'American Somoa','date_established'=>'1988-10-31','area_in_acres'=>9000000],
	['name'=>'Arches','location'=>'Utah','date_established'=>'1929-04-12','area_in_acres'=>1284767],
	['name'=>'Badlands','location'=>'South Dakota','date_established'=>'1978-11-10','area_in_acres'=>242755.94],
	['name'=>'Big Bend','location'=>'Texas','date_established'=>'1944-06-12','area_in_acres'=>801163.21],
	['name'=>'Biscayne','location'=>'Florida','date_established'=>'1980-06-28','area_in_acres'=>172924.07],
	['name'=>'Black Canyon of the Gunnison','location'=>'Colorado','date_established'=>'1999-10-21','area_in_acres'=>32950.03],
	['name'=>'Bryce Canyon','location'=>'Utah','date_established'=>'1928-02-25','area_in_acres'=>35835.08],
	['name'=>'Canyonlands','location'=>'Utah','date_established'=>'1964-09-12','area_in_acres'=>337597.83],
	['name'=>'Capitol Reef','location'=>'Utah','date_established'=>'1971-12-18','area_in_acres'=>241904.26],


	];

$truncate = 'TRUNCATE national_parks';
$dbc->exec($truncate);

 foreach($parksArray as $park){

$sql = "INSERT INTO national_parks (name, location, date_established, area_in_acres) 
VALUE('{$park['name']}','{$park['location']}','{$park['date_established']}',{$park['area_in_acres']})";
$dbc->exec($sql);//exec insert into db, but needs require connection and constants first
 } 

?>