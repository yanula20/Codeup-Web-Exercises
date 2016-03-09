<?php


function inputHas($key){

return isset($_REQUEST[$key]);//returns true  (1) or false (0)

}



function inputGet($key){

	return isset($_REQUEST[$key])? $_REQUEST[$key]: NULL;

}


function escape($input){

	return htmlspecialchars(strip_tags($input));
	
}


?>
