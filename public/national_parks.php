<?php 
//PDO connects to mysql parks db
require_once '../parks_db_connect.php';
require_once '../Input.php';

//from PREV and NEXT current page
$page = Input::has('page')? Input::get('page') : 1;

$limit = 4;


$offset = ($limit * $page)-$limit;

$stmt = $dbc->query("SELECT * FROM national_parks LIMIT $limit OFFSET $offset");
 
$parks = $stmt->fetchAll(PDO::FETCH_ASSOC);


//php either back ticks or nothing, pdostate obj -> with fetchColumn string with num, typecasted below
$count = $dbc->query("SELECT count('id') FROM national_parks")->fetchColumn();

$total_pages = $count/4;



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
     
    <?php if($page < $total_pages) { ?> 
    <a href="national_parks.php?page=<?=($page+1)?>">NEXT</a><br>
    <?php } ?>
  
    <?php if($page > 1 ) { ?>     
    <a href="national_parks.php?page=<?=($page-1)?>">PREVIOUS</a><br>
    <?php } ?>
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