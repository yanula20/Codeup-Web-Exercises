<?php 
//PDO connects to mysql parks db
require_once '../parks_db_connect.php';
require_once '../Input.php';

$page1 = 1;

$page2 = 2;

$page3 = 3;

$limit = 4;

$offset1 = ($limit * $page1)-$limit;

$offset2 = ($limit * $page2)-$limit;

$offset3 = ($limit * $page3)-$limit;

$var = Input::has('page')? Input::get('page') : 1;

switch ($var) {

    case 1:
  
    $stmt = $dbc->query("SELECT * FROM national_parks LIMIT $limit OFFSET $offset1");

 
    $parks = $stmt->fetchAll(PDO::FETCH_ASSOC);
        break;
    case 2:
        
    $stmt = $dbc->query("SELECT * FROM national_parks LIMIT $limit OFFSET $offset2");


    $parks = $stmt->fetchAll(PDO::FETCH_ASSOC);
        break;
    case 3:
         
    $stmt = $dbc->query("SELECT * FROM national_parks LIMIT $limit OFFSET $offset3");

    $parks = $stmt->fetchAll(PDO::FETCH_ASSOC);
        break;
   
    default:
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Template</title>
    <!-- order matters, my own stylesheet must go unederneath -->

    <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css">

    <link href='https://fonts.googleapis.com/css?family=Roboto+Slab' rel='stylesheet' type='text/css'> 
    <!---external personalized stylesheet-->
    <style type="text/css">

    /*css here*/

    </style>  
</head>
<body>
    <div id="wrapper">

    <?php foreach($parks as $park): ?>
    <h2><?=$park['name'] ?><h2>
    <h3><?=$park['location'] ?><h3>
    <h3><?=$park['date_established'] ?><h3>
    <h3><?=$park['area_in_acres'] ?><h3>
    <?php endforeach; ?>
        
    <a href="national_parks.php?=page=<?=$page1;?>">page 1</a><br>
  
         
    <a href="national_parks.php?page=<?=$page2;?>">page 2</a><br>


    <a href="national_parks.php?page=<?=$page3;?>">page 3</a><br>


     <!--html here-->


    </div> <!-- end wrapper   --> 

<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="/js/bootstrap.js"></script>

<script src="/jquery-ui-1.11.4.custom/js/query-ui.min.css"></script>
<script type="text/javascript">
      /*--js here--*/
</script>
<!---personalized js external file-->
  </body>
  </html>  