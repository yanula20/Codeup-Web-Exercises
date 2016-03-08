<?php

///creates assoc. array of ur data;
function pageController(){

    if(isset($_GET['counter'])){
         $counter = $_GET['counter'];

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
    <title>Counter Exercise</title>

<style type="text/css">
body{

    background-color: yellow;
    font-family: "Comic Sans MS", cursive, sans-serif;
}


</style>
</head>
<body>
    <h1><?=$counter;?></h1>  


        
    <a href="counter.php?counter=<?=$counter+1;?>">UP</a>

    <br>
    <br>
  
         
    <a href="counter.php?counter=<?=$counter-1;?>">DOWN</a>


</body>
</html>