<?php

///creates assoc. array of ur data;
function pageController(){
	$data = [];
	$data['favoriteThings'] = ['bike', 'Jersey', 'watch', 'car', 'Doughnuts'];
	return $data;
}

//extracts keys from aboveturns them into variables; 'favoriteThings' to $favorityThings
extract(pageController());

?>



<!DOCTYPE html>
<html>
<head>
    <title>Codeup!</title>
<style type="text/css">

body{

    background-color: yellow;
    font-family: "Comic Sans MS", cursive, sans-serif;
}

td {
    width: 600px;
    color: green;
    font-size: 30px;
   
}


h1 {
    width: 600px;
    color: red;
    font-size: 35px;
   
}

</style>
</head>
<body>
    <h1>My Favorite Things</h1>
    <table style="width:100%">
    <?php foreach ($favoriteThings as $key => $value) : ?>
    	<tr>
        <td><?= $value; ?></td>
       	</tr>
   <?php endforeach; ?>
    </table>
</body>
</html>

