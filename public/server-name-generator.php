<?php

$nouns = ['bike', 'Jersey', 'watch', 'car', 'Doughnuts'];

$adjectives = ['Fuzzy', 'Hairy', 'Greasy', 'Soapy', 'Hunchback'];



 function getServerNoun ($array) {

    return array_rand($array);
}


 function getServerAdjective ($array) {

     return array_rand($array);
}

$serverName =  getServerNoun($nouns) . ' ' . getServerAdjective($adjectives);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Server Name Generator</title>
 <style type="text/css">

h1{
	width: 600px;
	color: red;
	margin: 0 auto;
	font-size: 50px;
	font-family: Comic sans;
}

 </style>
</head>
<body>
   
        <h1><?php echo $serverName; ?></h1>
   
</body>
</html>