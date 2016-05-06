<?php

require_once 'parks_db_connect.php';

$truncate = 'TRUNCATE national_parks';
$dbc->exec($truncate);

$parksArray = [
	['name'=>'Acadia','description' => 'Acadia features the tallest mountain on the Atlantic coast of the United States','location'=>'Maine','date_established'=>'1919-02-26','area_in_acres'=>47389.67],
	['name'=>'American Somoa','description' => 'The southernmost national park is on three Samoan islands' ,'location'=>'American Somoa','date_established'=>'1988-10-31','area_in_acres'=>9000000],
	['name'=>'Arches','description' => 'This site features more than 2,000 natural sandstone arches' ,'location'=>'Utah','date_established'=>'1929-04-12','area_in_acres'=>1284767],
	['name'=>'Badlands','description' => 'The Badlands are a collection of buttes, pinnacles, spires, and grass prairies','location'=>'South Dakota','date_established'=>'1978-11-10','area_in_acres'=>242755.94],
	['name'=>'Big Bend','description' => 'Named for the prominent bend in the Rio Grande along the US–Mexico border','location'=>'Texas','date_established'=>'1944-06-12','area_in_acres'=>801163.21],
	['name'=>'Biscayne', 'description' => 'Located in Biscayne Bay, this park at the north end of the Florida Keys has four interrelated marine ecosystems: mangrove forest, the Bay, the Keys, and coral reefs.','location'=>'Florida','date_established'=>'1980-06-28','area_in_acres'=>172924.07],
	['name'=>'Black Canyon of the Gunnison', 'description' => 'The park protects a quarter of the Gunnison River, which slices sheer canyon walls from dark Precambrian-era rock' ,'location'=>'Colorado','date_established'=>'1999-10-21','area_in_acres'=>32950.03],
	['name'=>'Bryce Canyon','description' => 'Bryce Canyon is a giant geological amphitheater on the Paunsaugunt Plateau' ,'location'=>'Utah','date_established'=>'1928-02-25','area_in_acres'=>35835.08],
	['name'=>'Canyonlands','description' => 'TThere are rock pinnacles and other naturally sculpted rock formations, as well as artifacts from Ancient Pueblo peoples' ,'location'=>'Utah','date_established'=>'1964-09-12','area_in_acres'=>337597.83],
	['name'=>'Capitol Reef','description' => 'Natural features are monoliths, sandstone domes, and cliffs shaped like the United States Capitol','location'=>'Utah','date_established'=>'1971-12-18','area_in_acres'=>241904.26],


	];

foreach ($parksArray as $park) {
	$stmt = $dbc->prepare("INSERT INTO national_parks (name, description, location, date_established, area_in_acres) 
VALUES(:name,:description,:location,:date_established,:area_in_acres)"); 
	$stmt->bindValue(':name', $park['name'],PDO::PARAM_STR);
	$stmt->bindValue(':description', $park['description'], PDO::PARAM_STR);
	$stmt->bindValue(':location',$park['location'],PDO::PARAM_STR);
    $stmt->bindValue(':date_established',$park['date_established'], PDO::PARAM_STR);
    $stmt->bindValue(':area_in_acres',$park['area_in_acres'], PDO::PARAM_STR);
    $stmt->execute();
}

?>


