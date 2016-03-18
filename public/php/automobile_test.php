<?php

require_once "Automobile.php";

$make = 'vw';
$model = 'bug';
$color = "papayawhip";

$car1 = new Automobile($make, $model, $color);
$car1->miles = inputGet('miles');
$car1->save();

echo $car1->getDescription();

$yourCar = new Automobile('audi', 'A4', 'pink');
echo $yourCar->getDescription();
