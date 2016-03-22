<?php 

//PDO connects to mysql parks db
require_once '../parks_db_connect.php';
require_once '../Input.php';

//from PREV and NEXT current page
$page = Input::has('page')? Input::get('page') : 1;

$limit = 4;

$offset = ($limit * $page)-$limit;

$stmt = $dbc->prepare("SELECT * FROM national_parks LIMIT :limit OFFSET :offset");

$stmt->bindValue(':limit', $limit,PDO::PARAM_INT);

$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);

$stmt->execute();
 
$parks = $stmt->fetchAll(PDO::FETCH_ASSOC);

$count = $dbc->query("SELECT count('id') FROM national_parks")->fetchColumn();

$total_pages = $count/4;

if(!empty($_POST)){

    descAdd($dbc);

}

function descAdd($dbc){

    if(Input::has('desc') && Input::get('name') != ""){
        $description = Input::get('desc');
    }
    if(Input::has('parkId')){
        $parkIds = Input::get('parkId');
    }
 
var_dump($description);
Var_dump($parkIds);
$stmt = $dbc->prepare("UPDATE national_parks SET description = :description WHERE parks_id = :parks_id"); 
$stmt->bindValue(':description', $description, PDO::PARAM_STR);
$stmt->bindValue(':parks_id', $parkIds, PDO::PARAM_STR);
$stmt->execute();

}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>National Parks Exercise</title>
    <!-- order matters, my own stylesheet must go unederneath -->

    <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css">

    <link href='https://fonts.googleapis.com/css?family=Roboto+Slab' rel='stylesheet' type='text/css'> 
    <!---external personalized stylesheet-->

    <link rel="stylesheet" type="text/css" href="/css/parks_php_mysql.css">

</head>
<body>
    <div id="wrapper">

    <h1>National Parks</h1>

    <?php foreach($parks as $park): ?>
    <h2>Park name: <?=$park['name'] ?></h2>
    <h3>location: <?=$park['location'] ?></h3>
    <h4>Date established: <?=$park['date_established'] ?></h4>
    <h4>acres: <?=$park['area_in_acres'] ?></h4>
    <br>
    <form method="POST" action="national_parks.php">
        <textarea rows="10" cols="35" name="desc" placeholder="Enter park description"></textarea>
        <br>
        <input type="hidden" name="parkId" value=" <?=$park['parks_id'];?>">
        <input id="descAd" type="submit" >
    </form>
    <?php endforeach; ?>
     
    <?php if($page < $total_pages) { ?> 
    <a href="national_parks.php?page=<?=($page+1)?>">NEXT</a><br>
    <?php } ?>
  
    <?php if($page > 1) { ?>     
    <a href="national_parks.php?page=<?=($page-1)?>">PREVIOUS</a><br>
    <?php } ?>
     <!--html here-->

    </div> <!-- end wrapper   --> 

<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="/js/bootstrap.js"></script>

<script type="text/javascript">
      
</script>
<!---personalized js external file-->
  </body>
  </html>  