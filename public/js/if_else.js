// ignore these lines for now
// just know that the variable 'color' will end up with a random value from the colors array
var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];
var color = colors[Math.floor(Math.random()*colors.length)];

var favorite = 'green'; // TODO: change this to your favorite color from the list

// TODO: Create a block of if/else statements to check for 
//every color except indigo and violet.console.log('The random color turned out to be my favorite color green!')
(color === favorite)?console.log("My favorite color is "+favorite+" !!"):console.log("Not my fav");

 if (color ==! 'indigo' || 'violet'){
 	document.body.style.background = "green"
 	alert("JS ignored indigo and violet");
} else if (color === 'indigo' || 'violet') {
	document.body.style.background = "red";
	alert("JS did not ignore indigo and violet in the array");
}

//below if/else is false b/c i am comparing an array with a string
//a red background is the result
 if (color === favorite){
 	alert("green is my favorite color")
 	document.body.style.background = "green";
} else if (color === 'indigo' || 'violet') {
	document.body.style.background = "indigo"
	alert("This is indigo. Hit OK to see Violet")
	document.body.style.background = "violet"
	alert("This is Violet. Hit OK to do the Random color check exercise");
}
// TODO: When a color is encountered log a message 
//that tells the color, and an object of that color.
//       Example: Blue is the color of the sky.

alert("Next Exercise")

 if (color === 'red') {
 	document.body.style.background = "red";
 	alert("An apple is red. Hit OK to check the next color");
} else if (color === 'orange') {
 	document.body.style.background = "orange";
 	alert("An Orange is orange. Hit OK to check the next color");
} else if (color === 'yellow'){
	document.body.style.background = "yellow";	
	alert("A Codeup Ducky is yellow. Hit OK to check the next color");
} else if (color === 'green') {
 	document.body.style.background = "green";
 	alert("An avocado is green. Hit OK to check the next color");
} else if (color === 'blue') {
 	document.body.style.background = "blue";
 	alert("The Duke University Devil is Blue. Hit OK to check the next color");
} else {
 	alert("I don't know anything about that color.");	
} 

 	
 	








// TODO: Have a final else that will catch indigo and violet.
// TODO: In the else, log: I do not know anything by that color.

// TODO: Using the ternary operator, conditionally log a statement that
//       says whether the random color matches your favorite color.
alert("Endex")