<?php 

//PDO connects to mysql parks db
require_once '../parks_db_connect.php';
require_once '../Input.php';

$errors = [];
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

    $errors=descAdd($dbc);

}

function descAdd($dbc){

     $errors = [];

     var_dump($_POST['date_established']);
   

    try {
          $name = Input::getString('name');

    } catch (Exception $e){

        //get Exceptiion msg and push to array
        $errors[] = $e->getMessage();

    }

    try {
          $description = Input::getString('description');

    } catch (Exception $e){

        $errors[] = $e->getMessage();

    }

    try {
          $location = Input::getString('location');

    } catch (Exception $e){

        $errors[] = $e->getMessage();

    }

    try {
          $date_established = Input::getDate('date_established');

    } catch (Exception $e){

        $errors[] = $e->getMessage();

    }

    try {
          $area_in_acres = Input::getNumber('area_in_acres');

    } catch (Exception $e){

        $errors[] = $e->getMessage();

    }
    
    if(empty($errors)){

        $name = Input::getString('name');
        $description = Input::getString('description');
        $location = Input::getString('location');
        $date_established = Input::getString('date_established');
        $area_in_acres = Input::getNumber('area_in_acres');



     $stmt = $dbc->prepare("INSERT INTO national_parks (name,description,location,date_established,area_in_acres) VALUES (:name,:description,:location,:date_established,:area_in_acres)"); 
        $stmt->bindValue(':name', $name, PDO::PARAM_STR);
        $stmt->bindValue(':description', $description, PDO::PARAM_STR);
        $stmt->bindValue(':location', $location, PDO::PARAM_STR);
        $stmt->bindValue(':date_established', $date_established, PDO::PARAM_STR);
        $stmt->bindValue(':area_in_acres', $area_in_acres, PDO::PARAM_STR);
        $stmt->execute();
    }

   var_dump($errors);     
 return $errors;


}//end descAdd

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
    <?php endforeach; ?>
     <form method="POST" action="national_parks.php">
        <textarea rows="1" cols="35" name="name" placeholder="Enter park name" value="<?=empty($errors)? '' : Input::get('name','')?>"></textarea>
        <br>
        <textarea rows="10" cols="35" name="description" placeholder="Enter park description"></textarea>
        <br>
         <textarea rows="1" cols="35" name="location" placeholder="Enter park location"></textarea>
        <br>
        <textarea rows="1" cols="35" name="date_established" placeholder="Enter date established: YYYY-MM-DD" type="date" maxlength="10"></textarea>
        <br>
         <textarea rows="1" cols="35" name="area_in_acres" placeholder="Enter park acres" type="text" maxlength="12"></textarea>
         <br>
        <input id="descAd" type="submit" >
    </form>

    <?php foreach($errors as $error): ?>
        <p><?= $error ?></p><br>
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