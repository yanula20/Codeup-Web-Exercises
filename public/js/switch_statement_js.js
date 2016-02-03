// ignore these lines for now
// just know that the variable 'color' will end up with a random value from the colors array
var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
var color = colors[Math.floor(Math.random()*colors.length)];



    // todo: create a case statement that will handle 
    //every color except indigo and violet

 switch (color) {
 	//swith is like the if statement, case is like else if
   
    case "red":
    	document.body.style.background = "red";
        console.log("I am as red as an apple.");
    	break;
    case "orange":
    	document.body.style.background = "orange";
        console.log("I am an orange orange.");
        break;
    case "yellow":
    	document.body.style.background = "yellow";
        console.log("I am a yellow Codeup Ducky.");
        break;
    case "green":
    	document.body.style.background = "green";
        console.log("I am a green avocado.");
        break;
    case "blue":
    	document.body.style.background = "blue";
        console.log("I am blue as the sky.");
        break;
    default:      
		alert("I don\'t know this color.");
    }

 
    // todo: when a color is encountered log a message that tells the color, and an object of that color
    //       example: Blue is the color of the sky.

    // todo: create a default case that will catch indigo and violet
    // todo: for the default case, log: I do not know anything by that color.
