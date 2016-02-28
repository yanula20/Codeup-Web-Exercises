<?php

$russ = 'Russian';

$kor = 'Korean';

$languages = ['French','German',"$russ"];//double quotes on $russ

$languages2 = ['Polish','Chinese',$kor];

var_dump($languages);

print_r($languages);

var_dump($languages2);

print_r($languages2);

echo "<br><br>$languages[0]";

echo "<br>$languages[1]<br>";

echo "$languages[2]";

//Associative Array

$person4['first_name'] = 'Joe';
$person4['last_name'] = 'Blow';
$person4['e-mail'] = 'myemail4@email.com';


$person1 = [
	'first_name'  => 'Billy',
	'last_name' => 'the Kid',
	'e-mail'  => 'myemail1@email.com'
];

$person2 = [
	'first_name'  => 'Pat',
	'last_name' => 'Garret',
	'e-mail'  => 'myemail2@email.com'
];


$person3 = [
	'first_name' => 'Will',
	'last_name' => 'Smith',
	'e-mail'  => 'myemail3@email.com'
];


$person5 = [
	'$irst_name' => 'Samuel',
	'last_name' => 'Jackson',
	'e-mail'  => 'myemail5@email.com'
];

$people = [
	'person1' => $person1, 
	'person2' => $person2, 
	'person3' => $person3,
	'person4' => $person4,
	'person5' => $person5
	];
	

$book1 = [
	'title' => 'I love cats!',
	'category' => 'paperback',
	'pages'  => '100'
];


$book2 = [
	'title' => 'I love dogs!',
	'category' => 'hard cover',
	'pages'  => '55'
];


$book3 = [
	'title' => 'I love giraffes!',
	'category' => 'paperback',
	'pages'  => '300'
];

$book4 = [
	'title' => 'I love turtles!',
	'category' => 'hard cover',
	'pages'  => '7'
];

$bookResults = [
	'book1' => $book1, //k:v
	'book2' => $book2, 
	'book3' => $book3,
	'book4' => $book4

];

//echo "{$bookResults}['book1']['title']";


$author1 = [
	'first_name' => "Jason",
	'last_name' => "Bourne",
	'age' => 30
];

//echo "{$bookResults}['book1']"

$bookResults['book1']['author'] = $author1; //must be below $bookResults 

$author2 = [
	'first_name' => "Willy",
	'last_name' => "Wonka",
	'age' => 14
];

$author3 = [
	'first_name' => "Terry",
	'last_name' => "Tate",
	'age' => 56
];


$author4 = [
	'first_name' => "Samuel",
	'last_name' => "Jefferson",
	'age' => 61
];

$authors = [
'author1' => $author1['last_name'],
'author2' => $author2['last_name'],
'author3' => $author3['last_name'],
'author4' => $author4['last_name'],
];


$numbers = array(1,2,3,4,5);

var_dump($numbers);

print_r($numbers);

$numbers2 = [1,2,3,4,5,6,7,8];

var_dump($numbers[3]);

print_r($numbers2[3]);

$people = [
	'person1' => $person1,
	'person2' => $person2

];
?>