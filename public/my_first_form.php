<!DOCTYPE html>
<!--HTML inputs should also have a name attribute that describes what the 
    input is. The name attribute for the input will appear as the key in the 
    query string when the form is submitted.-->  

    <!--Form inputs can be defined by using the HTML <input> element. The 'input' 
    element is a void element, since it doesn't have any inner content.-->  

    <!--Additionally, an id attribute with the same value as the name attribute is 
    often specified with the 'input'. The id attribute is used for input labeling 
    and also for easy access via JavaScript. --> 

	<!--Some input types, like submit, text, placeholder, password, and email, can 
	have an initial value set by using the value attribute.-->

	<!--'<button type="submit">Login</button>'.This example will display the same result 
	as the previous one. The main reason to use a 'button> over an <input type="submit> 
	is that the <button> element is not a void element and can contain other elements. 
	t also offers more styling possibilities.-->

	<!--margin-right works well for expanding labels across the page.-->

	<!--Do not leave out the "name" attribute in your input fields, test choices,
	blanks of fill-in forms. Without them, key (name)=value (user-defined) string will not be submitted to the
    server. You don't need a "name" for Submit, Enter buttons-->
		

<html>
<head>
	<meta charset="utf-8">

	<?php var_dump($_GET); 
	var_dump($_POST);
	?>

    <title>My First HTML form</title>
    
    <style type="text/css">

    body h4 { 
    	background-color:
    	rgba(255, 0, 0, 0.3);  /* red with opacity */
    	width: 90%;
    	text-decoration: underline; 
    	margin-bottom: 10px;
    }

    body label { background-color: yellow; margin-right: 20px

    }

    body option { background-color: orange; width: 50%; margin-right: 20px;
    	/* Within labels and options, experiment with background color, width %, 
	margin-right px */
    }
    
    body { 
    	font-family: "comic sans ms", Times, "Papyrus" 
    }

    body button { 
    	background-color: violet; 
    	font-family: "comic sans ms", Times, "Papyrus" 
    }
    #Compose_e-mail textarea { color: red;
    }

 	#Compose_e-mail label { color: blue;
    }
     
    #Compose_e-mail button { color: red;
    }

    </style>
    
</head>
<body>
	<h4 id="User Login">User Login</h4>
	<form method="POST" action="/my_first_form.php">
	    <p>
	        <label for="username">Username</label>
	        <input id="username" name="username" placeholder="Enter your username" 
	        type="text">
	    </p>
	    <p>
	        <label for="password">Password</label>
	        <input id="password" name="password" placeholder="Enter your password" 
	        type="password">
	    </p>
	    <p>
	    	<label for="Login"></label>
	        <button id="Login" name="Login" type="Submit"><strong>Login</strong></button>
	    </p>
	</form>
	
	<form>
		<h4 id="Compose_e-mail">Compose an e-mail</h4>

		<textarea id="To" type="text" name="recipient" rows="1" cols="40" 
		placeholder="To:"></textarea><br>

		<textarea id="From" type="text" name="sender" rows="1" cols="40" 
		placeholder="From:"></textarea><br>

		<textarea id="Subject" type="text" name="subject" rows="1" cols="40" 
		placeholder="Subject:"></textarea><br>

		<textarea id="e-mail_body" type="text" name="e-mailbody" rows="10" cols="40" 
		placeholder="Compose:"></textarea><br>

		<label for="Sent_folder">Save a copy in your Sent folder?</label><br>
		<button id="Sent_folder" name="sent_folder" type="Submit" checked><strong>Send</strong></button>
	</form> 

	<form>
	<!--Giving radio buttons the same name puts them in the same group. 
	Only one radio button in a group can be checked at a time. 
	The name for radio buttons does not need to end with square brackets [] 
	since only one of the values ever is submitted at a time. Just like 
	checkboxes, the checked attribute can be added to a radio button to 
	make it the default selection.-->
	<h4>Multiple Choice Test</h4>
	
	<h4>What is 2 + 2?</h4>
		<label><input type="radio" name="q1" value="7">7</label><br>
		<label><input type="radio" name="q1" value="2">2</label><br>
		<label><input type="radio" name="q1" value="4">4</label><br>
		<label><input type="radio" name="q1" value="0">0</label>

	<h4>Which team won the NCAA basketball Championship in 2014?</h4>
		<label><input type="radio" name="q2" value="Duke Blue Devils">Duke Blue Devils</label><br>
		<label><input type="radio" name="q2" value="Seton Hall Friars">Seton Hall Friars</label><br>
		<label><input type="radio" name="q2" value="Maryland Terrapins">Maryland Terrapins</label><br>
		<label><input type="radio" name="q2" value="UCLA Bruins">UCLA Bruins</label>

	<h4>Which of the countries below end in the letter "a"?</h4>
		<label><input type="checkbox" id="country1" name="country[]" value="Guyana">Guyana</label><br>
		<label><input type="checkbox" id="country2" name="country[]" value="Norway">Norway</label><br>
		<label><input type="checkbox" id="country3" name="country[]" value="Canada">Canada</label><br>
		<label><input type="checkbox" id="country4" name="country[]" value="Afghanistan">Afghanistan</label><br>
		<label><input type="checkbox" id="country5" name="country[]" value="Malaysia">Malaysia</label><br>
		<label><input type="checkbox" id="country6" name="country[]" value="Singapore">Singapore</label><br>
	
		<label for="Multiple_Choice_Test"></label>
	    <button id="Multiple_Choice_Test" type="Submit"><strong>Submit Answers</strong></button>
	</form>

	<form>
	<h4>Select Testing-Who is the current US President?</h4>
		<label for="President">Select the correct answer from the drop-down menu:></label><br>
		<select id="President" name="President">
			<option>Barack Obama</option>
			<option selected>George Washington</option>
		<label for="Presidents_Test"></label>
	    <button id="Presidents_Test" name="Presidents_Answers" type="Submit"><strong>Submit Answers</strong></button>

		</select>
	</form>

	<form>
	<h4>Select Testing-Which cities have NFL football teams?</h4>
		<label for="football_team">Select the correct answers below:</label><br>
		<select id="football_team" name="city[]" multiple>
			<option name="city1" value="Baltimore, MD">Baltimore, MD</option>
			<option name="city2" value="San Diego, CA">San Diego, CA</option>
			<option name="city3" value="Austin, TX">Austin, TX</option>
			<option name="city4" value="Las Vegas, NV">Las Vegas, NV</option>
			<option name="city5" value="Annapolis, MD">Annapolis, MD</option>
			<option name="city6" value="Monterey, CA">Monterey, CA</option>
			<option name="city7" value="Hattiesburg, MS">Hattiesburg, MS</option>

		<label for="Football_Test"></label>
	    <button id="Football_Test" name="Football_Answers" type="Submit"><strong>Submit Answers</strong></button>
		</select>
	</form>

	<form>
	<h4>Select Testing-Which of the following are American-made cars?:</h4>
		<label for="American_car">Select the correct answers below:</label><br>
		<select id="American_Car" name="car[]" multiple>
			<option value="Ford Escort">Ford Escort</option>
			<option value="Chrysler LeBaron">Chrysler LeBaron</option>
			<option value="Yugo">Yugo</option>
			<option value="Buick Enclave">Buick Enclave</option>
			<option value="Nissan Pathfinder">Nissan Pathfinder</option>
			<option value="Audi">Audi</option>
			<option value="Ford Focus">Ford Focus</option>			
		</select><br>
		<button id="USA_cars" type="text" type="Submit"><strong>Send</strong></button>
	</form>

	<form>
	<h4>Select Testing-Which of the following are American-made cars?:</h4>
		<label for="American_car">Select the correct answers below:</label><br>
		<select id="American_Car" name="car[]" multiple>
			<option>Ford Escort</option>
			<option>Chrysler LeBaron</option>
			<option>Yugo</option>
			<option>Buick Enclave</option>
			<option>Nissan Pathfinder</option>
			<option>Audi</option>
			<option>Ford Focus</option>
		</select><br>
		<button id="USA_cars2" type="text" type="Submit"><strong>Send</strong></button>
	</form>

	<form>
	<h4>Select Testing - Operating Systems</h4>
		<label for="os">What operating systems have you used? </label><br>
		<select id="os" name="os[]" multiple>
			<option value="linus">Linux</option>
			<option value="osx">OS X</option>
			<option value="windows">Windows</option>
		</select><br>
		<button id="ST_os" type="text" type="Submit"><strong>Send</strong></button>
	</form>
</body>
</html>