<?php
require '../twitterproxy.php';
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

body{
    background-color: lightblue;
    color : black;

}

#tweetResults{
    font-size: 25px;
}

body p {

   color :black;
}

#profiles{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 770px;
    border: 1px green;
    background-color: yellow;
    margin: 0 auto;
 }


#map-canvas {

    width: 770px;
    height: 481px;
}

form {
    width: 700px;
    margin: 0 auto;
    padding: 0px;
}

#container {
    margin: 0 auto;
    width: 770px;
    font-family: "Comic Sans MS", cursive, sans-serif;
    
    background-color: lightblue;
    background-image: -webkit-linear-gradient(top, lightblue 0%, blue 100%);
}

#language{

    width: 225px;
}

.carousel-inner{
    display: flex;
    flex-direction: row;
    width: 350px;
    margin: 0 auto;
    

}

#heat_form{
    background-color: white;
}

#flex_heat{
    display: flex;
    flex-direction: row;
    justify-content: space-between;

}
   </style>  
</head>
<body>
    <div id="wrapper">

        <div id ="container">

            <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBJMMD6k9NVgkv5xDAcIaENzanI8psOI44"></script>

            <header id="weather_header">
                <h2>Code Connection</h2>
                <h1 id="searchedCity"></h1>
            </header>
            <br>

            <div id="coordinates">
                <form>
                    <label for="address">Enter City: </label>
                        <input id="address" type="text">
                    <label for="language">Enter Language: </label>
                        <input id="language" type="text" placeholder="javascript or ruby or python">
                    <button id="submit-address" type="submit">Submit</button>
                </form>
            </div>

            <div id="map-canvas"></div>

        </div>  <!--  end container -->
        <br>
        <br>
            <div>
                <form id="heat_form">
                    <div id="flex_heat">
                        <input class="source" type="checkbox" value="javascript" >Javascript<br>
                        <input class="source" type="checkbox" value="ruby" >Ruby<br>
                        <input class="source" type="checkbox" value="python">Python<br>
                        <input class="source" type="checkbox" value="php" >PHP<br>
                        <input class="source" type="checkbox" value="assembly" >Assembly<br>
                        <button id="submit-heatmap" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        <br>

        <div id="myCarousel" class="carousel slide" data-ride="carousel">
          <!-- Indicators -->
          <ol class="carousel-indicators">
            <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
            <li data-target="#myCarousel" data-slide-to="1"></li>
            <li data-target="#myCarousel" data-slide-to="2"></li>
            <li data-target="#myCarousel" data-slide-to="3"></li>
            <li data-target="#myCarousel" data-slide-to="4"></li>
            <li data-target="#myCarousel" data-slide-to="5"></li>
            <li data-target="#myCarousel" data-slide-to="6"></li>
            <li data-target="#myCarousel" data-slide-to="7"></li>
            <li data-target="#myCarousel" data-slide-to="8"></li>
            <li data-target="#myCarousel" data-slide-to="9"></li>
            <li data-target="#myCarousel" data-slide-to="10"></li>
            <li data-target="#myCarousel" data-slide-to="11"></li>
            <li data-target="#myCarousel" data-slide-to="12"></li>
            <li data-target="#myCarousel" data-slide-to="13"></li>
            <li data-target="#myCarousel" data-slide-to="14"></li>
            <li data-target="#myCarousel" data-slide-to="15"></li>
            <li data-target="#myCarousel" data-slide-to="16"></li>
            <li data-target="#myCarousel" data-slide-to="17"></li>
            <li data-target="#myCarousel" data-slide-to="18"></li>
            <li data-target="#myCarousel" data-slide-to="19"></li>
            <li data-target="#myCarousel" data-slide-to="20"></li>
            <li data-target="#myCarousel" data-slide-to="21"></li>
            <li data-target="#myCarousel" data-slide-to="22"></li>
            <li data-target="#myCarousel" data-slide-to="23"></li>
            <li data-target="#myCarousel" data-slide-to="24"></li>
            <li data-target="#myCarousel" data-slide-to="25"></li>
            <li data-target="#myCarousel" data-slide-to="26"></li>
            <li data-target="#myCarousel" data-slide-to="27"></li>
            <li data-target="#myCarousel" data-slide-to="28"></li>
            <li data-target="#myCarousel" data-slide-to="29"></li>
            <li data-target="#myCarousel" data-slide-to="30"></li>

          </ol>

          <!-- Wrapper for slides -->
          <div class="carousel-inner" role="listbox">

            <div class="item active">
              <img src="http://placehold.it/350x150?text=Search for a location and a language above the map!">
            </div>

          </div> <!-- end carousel inner -->

          <!-- Left and right controls -->
          <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">
            <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
          </a>
          <a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">
            <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
          </a>

        </div> <!-- myCarousel -->
        <br>
        <div id="tweetResults">
       

        </div>


     <!--html here-->

    </div> <!-- end wrapper   --> 

<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous">
    </script>
<script type="text/javascript">
     // (function(){
"use strict;"
var address;
var language;


$(document).ready(function() {

    var mapOptions = {
            
        zoom: 11,
         center: {
            lat:  29.4284595,
            lng: -98.492433
        },
        mapTypeId: google.maps.MapTypeId.HYBRID
    };

    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

function getGitHubData(language,address){
        
    $.get("https://api.github.com/search/users?q=language:"+"\""+language+"\""+"location:"+"\""+address+"\""+"sort:followers").done(function(data) {

            console.log(address);
            alert("AJAX call completed successfully!");

            console.log("Data returned from server:");

            console.log(data);

            console.log('This is the total users:'+data.total_count+' with '+language+' in '+address);

            data.items.forEach(function (items, index, array) {

                var profileString = ""
                profileString += "<div class=\"item\">"
                profileString += "<p>"+"rank by followers: "+(index+1)+"<p>"
                profileString += "<p>"+"LOCATION: "+address+"</p>"
                profileString += "<p>"+"LANGUAGE: "+language+"</p>"
                profileString += "<p>"+"user_login: "+items.login+"<p>"
                profileString += "<p>"+"repos_url: "+items.repos_url+"</p>"
                profileString += "<p>"+"followers_url: "+items.followers_url+"</p>"
                profileString += "</div>"

                $(".carousel-inner").append(profileString);
             

            }); //end foreach



            var languageObj = [{//element

                language: "javascript",
                description: address,
                image: "<img src=\"/img/langicons/js.png\" alt=\"javascript\">",
                iconUrl: "/img/langicons/js.png",
                strokeColor: '#FFEA05',
                fillColor: '#FFEA05',
               
                },{//element..address,element.description,
                language: "python",
                description: address,
                image: "<img src=\"/img/langicons/python.jpeg\" alt=\"python\">",
                iconUrl: "/img/langicons/python.png",
                strokeColor: '#368EED',
                fillColor:  '#368EED'
                
                },{
                language: "ruby",
                description: address,
                image: "<img src=\"/img/langicons/ruby.png\" alt=\"ruby\">",
                iconUrl: "/img/langicons/ruby.png",
                strokeColor: '#FF0000',
                fillColor: '#FF0000'

            }];

            switch(language){

                case "javascript":
                console.log('js icon here');
                languageObj.image = "<img src=\"/img/langicons/js.png\" alt=\"javascript\">";
                languageObj.iconUrl = "/img/langicons/js.png";
                languageObj.strokeColor = '#FFEA05',
                languageObj.fillColor = '#FFEA05'

                break;

                case "python":
                console.log('python icon here');
                languageObj.image = "<img src=\"/img/langicons/python.jpeg\" alt=\"python\">";
                languageObj.iconUrl = "/img/langicons/python.jpeg";
                languageObj.strokeColor = '#368EED',
                languageObj.fillColor = '#368EED'

                break;

                case "ruby":
                console.log('ruby icon here');
                languageObj.image = "<img src=\"/img/langicons/ruby.png\" alt=\"ruby\">";
                languageObj.iconUrl = "/img/langicons/ruby.png";
                languageObj.strokeColor = '#FF0000',
                languageObj.fillColor = '#FF0000'
                break;

                case "ruby on rails":
                console.log('ruby on rails icon here');
                languageObj.image = "<img src=\"/img/langicons/rubyonrails.jpeg\" alt=\"rubyonrails\">";
                languageObj.iconUrl = "/img/langicons/rubyonrails.jpeg";
                languageObj.strokeColor = '#FFB3B3',
                languageObj.fillColor = '#FFB3B3'
                break;


                case "c":
                console.log('c icon here');
                languageObj.image = "<img src=\"/img/langicons/c.png\" alt=\"c\">";
                languageObj.iconUrl = "/img/langicons/c.png";
                languageObj.strokeColor = '#90A1D4',
                languageObj.fillColor = '#90A1D4'
                break;


                case "c++":
                console.log('c++ icon here');
                languageObj.image = "<img src=\"/img/langicons/c++.jpeg\" alt=\"c++\">";
                languageObj.iconUrl = "/img/langicons/c++.jpeg";
                languageObj.strokeColor = '#2EB89A',
                languageObj.fillColor = '#2EB89A'
                break;



                case "c#":
                console.log('c# icon here');
                languageObj.image = "<img src=\"/img/langicons/csharp.jpeg\" alt=\"c#\">";
                languageObj.iconUrl = "/img/langicons/csharp.jpeg";
                languageObj.strokeColor = '#FFB3B3',
                languageObj.fillColor = '#FFB3B3'
                break;

                case "mysql":
                console.log('mysql icon here');
                languageObj.image = "<img src=\"/img/langicons/mysql.png\" alt=\"mysql\">";
                languageObj.iconUrl = "/img/langicons/mysql.png";
                languageObj.strokeColor = '#DAEBE7',
                languageObj.fillColor = '#DAEBE7'
                break;


                case "lisp":
                console.log('lisp icon here');
                languageObj.image = "<img src=\"/img/langicons/lisp.jpeg\" alt=\"lisp\">";
                languageObj.iconUrl = "/img/langicons/lisp.jpeg";
                languageObj.strokeColor = '#0D4035',
                languageObj.fillColor = '#0D4035'
                break;

            }

            var geocoder = new google.maps.Geocoder ();
            geocoder.geocode({"address": address}, function(results, status) {

                var lat = results[0].geometry.location.lat();

                var long = results[0].geometry.location.lng();

                var latlng = {
                    lat: lat,
                    lng: long
                };

                console.log(latlng);

                if (status == google.maps.GeocoderStatus.OK) {
                     console.log(results);
                     console.log(status);

                    var marker = new google.maps.Circle ({

                        center: latlng,
                        map: map,
                        strokeOpacity: 0.8,
                        strokeWeight: 1,
                        draggable: true,
                        geodesic: true,
                        strokeColor: languageObj.strokeColor,
                        fillColor: languageObj.fillColor,
                        fillOpacity: 0.35,
                        label: data.total_count,
                        radius: Math.sqrt(data.total_count)*500,

                    }); 
                    

                    marker.setMap(map);

                    var direction = 1;
                    var rMin = Math.sqrt(data.total_count)*500, rMax = Math.sqrt(data.total_count)*525;
                    setInterval(function() {
                        var radius = marker.getRadius();
                        if ((radius > rMax) || (radius < rMin)) {
                            direction *= -1;
                        }
                        marker.setRadius(radius + direction * 10);
                    }, 1);


                    var markerLanguage = new google.maps.Marker ({
                        
                        position: results[0].geometry.location,
                        map: map,
                        icon: languageObj.iconUrl,
                        animation : google.maps.Animation.DROP,
                        draggable: true
                   
                    }); 

                    map.panTo(results[0].geometry.location);

                    var infowindow = new google.maps.InfoWindow({
                        content: "The number of self-identified "+language+" programmers in "+address+" is "+
                        data.total_count,
                        position: latlng
                        
                    });

                    markerLanguage.addListener('mouseover', function(){
                        infowindow.open(map, marker);
                    });

                       markerLanguage.addListener('mouseout', function(){
                        infowindow.close(map, marker);
                    });

                }else {

                    alert("Geocoding was not successful - STATUS: " + status);

                }

                
                    console.log(language);
                    console.log(typeof(language));
                    console.log(address+"for twitter below");

                $.get('../twitterproxy.php?url='+encodeURIComponent("search/tweets.json?geocode="+lat+","+long+",60mi&count=100&q="+language),function(d){
                    

                    alert("twitter get call completed successfully!");
                    console.log("Data returned from server:");
                    console.log(d);
                    console.log(address);
                    console.log(language);

                    
                    d.statuses.forEach(function (element, index, array) {
                    
                    var twitterResults = ""
                    twitterResults += "<div>"
                    twitterResults += "<p>"+"Created : "+element.created_at+"<p>"
                    twitterResults += "<p>"+"Name : "+element.user.name+"<p>"
                    twitterResults += "<p>"+"Location : "+element.user.location+"<p>"
                    twitterResults += "<p>"+"Screen Name : "+element.user.screen_name+"<p>"
                    twitterResults += "<p>"+"Location: "+element.user.location+"<p>"
                    twitterResults += "<p>"+"LANGUAGE: "+language+"</p>"
                    twitterResults += "<p>"+"Tweet : "+element.text+"<p>"
                    twitterResults += "<p>"+"Description : "+element.user.description+"</p>"
                    twitterResults += "</div><br><br>"

                    $("#tweetResults").append(twitterResults);
                 

                }); //end foreach
                
            }).fail(function() {
                alert("There was an error!");
            }).always(function() {
                alert("And we're finished!");
            }); //end ajax twittter

        }); //end geocoder

    }).fail(function() {
                alert("There was an error!");
            }).always(function() {
                alert("And we're finished!");
            });//end ajax github

}//end getGitHubData

$("#submit-address").click(function(e){
    $(".carousel-inner").innerHTML = "";
    $("#tweetResults").innerHTML = "";

    address = $("#address").val();
    language = $("#language").val();
    e.preventDefault();
    getGitHubData(language,address);
   
});

$("#submit-heatmap").click(function(){
    var selected_value = []; // initialize empty array 
    
    $(".source:checked").each(function(){

        selected_value.push($(this).val());

        console.log(selected_value);

        selected_value.forEach(function (language, index, array) {

        console.log(language+'make my density circle on the map');

        });
    });
        
});
   
    console.log('hi'); 

    alert( 'The DOM has finished loading!');
                       
}); //end document scope
// })();   //end IFFE
                

</script>
<!---personalized js external file-->
</body>
</html>  