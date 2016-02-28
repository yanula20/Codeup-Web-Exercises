<?php
$book1 = [
	'title'	=>	'Labyrinths',
	'author' => [
		'first_name' => 'Jorge',
		'last_name' => 'Lois Portes'
	],
	'pages' => 200,
	'genre' => 'Magic Realism'
];

$book2 = [];

$book2['title'] = 'Mean Genes';

// $book2['author'] = [
// 	'first_name' => 'Terry',
// 	'last_name' => 'Burnham'
// ];
// $book2['author'] = [];
// $book2['author']['first_name'] = 'Terry';
// $book2['author']['last_name'] = 'Burnham';

$author2 = [
	'first_name' => 'Terry',
	'last_name' => 'Burnham'
];

$book2['author'] = $author2;

$book2['pages'] = 272;

$book2['genre'] = 'Psychological Aspects of Kung Fu';

$book3 = [
	'title' => 'Still Life With Woodpeckers',
	'author' => [
		'first_name' => 'Tom',
		'last_name' => 'Robbins'
	],
	'pages' => 200,
	'genre' => 'Contemporary Fiction'
];

$books = ['book1' => $book1, 'book2' => $book2, 'book3' => $book3];
// print_r($books);
echo "{$books['book1']['title']} was written by {$books['book1']['author']['first_name']} {$books['book1']['author']['last_name']} and has {$books['book1']['pages']} pages";
