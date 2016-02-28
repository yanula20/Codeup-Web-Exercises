<?php


define('NAME_ORIGINAL' , 'Donny');

echo 'My name is ' . NAME_ORIGINAL . PHP_EOL . '<br>';

define('OTHER_NAME', 'Quickbear');

echo 'My name is ' . OTHER_NAME . PHP_EOL . '<br>';

$marine = OTHER_NAME . " served with me in Hawaii. <br>";

echo $marine;

// echo 'This is Don's X-box 360.';

echo 'This is Don\'s X-box 360. <br>';

$word = "Hello";

echo "$word World<br>";

echo $word . ' World<br>';

echo '$word World<br>'; //single quotes won't string interpolate,literal

$aHereDocExample = <<<TEXT
This is some text used in a<br>
HereDOC example.<br>The text has
multiple lines.
TEXT;

echo $aHereDocExample;


?>