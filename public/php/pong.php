<?php

require_once '../../Input.php';


///creates assoc. array of ur data;

function pageController(){

	if(Input::has('counter')){

		$counter = Input::get('counter');

	}else{

			$counter = 0;
	}


    return array(

        'counter' => $counter

    );

}


//extract values out of assoc array above. extract keys even if key is an array;
extract(pageController());


?>

<!DOCTYPE html>
<html>
<head>
    <title>Pong</title>
<style type="text/css">
body{

    background-color: yellow;
    font-family: "Comic Sans MS", cursive, sans-serif;
}

</style>
</head>
<body>

  	<h1><?=$counter;?></h1>
        
    <a href="ping.php?counter=<?=$counter+1;?>">HIT</a>
  
         
    <a href="ping.php?counter=<?=$counter-1;?>">MISS</a>


</body>
</html>