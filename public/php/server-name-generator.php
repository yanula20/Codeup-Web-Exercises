<?php

 function getServerNameAndAdjective ($array) {

    $key = array_rand($array);

    $value = $array[$key];

    return  $value;

}

function pageController(){

    $data = [];

    $nouns = ['bike', 'Jersey', 'watch', 'car', 'Doughnuts','Avocado','Scuba Gear', 'giraffe', 'lemon', 'snake'];

    $adjectives = ['Fuzzy', 'Hairy', 'Greasy', 'Soapy', 'Hunchback', 'Russian', 'German', 'sour', 'prickly', 'rubbery'];

    $data['serverName'] = getServerNameAndAdjective($adjectives) . ' ' . getServerNameAndAdjective($nouns);

    return $data;

}
//extracts keys from aboveturns them into variables; 'serverName' to $serverName
extract(pageController());

?>

<!DOCTYPE html>
<html>
<head>
    <title>Server Name Generator</title>
 <style type="text/css">

h1{
	width: 600px;
	color: green;
	font-size: 50px;
    margin: 0 auto;
}
	

h3 {
    width: 600px;
    color: green;
    font-size: 30px;
   
}


body{

    background-color: yellow;
    font-family: "Comic Sans MS", cursive, sans-serif;
}



 </style>
</head>
<body>

     <h3>Random Server Name Generator:</h>

     <br>
     <br>
   
    <h1><?= $serverName; ?></h1>

    
   
</body>
</html>