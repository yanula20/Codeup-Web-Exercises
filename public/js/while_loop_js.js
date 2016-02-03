"use strict";
/*notes: 
* iteration: num=num+1; num++; num+=;
*
*
*
*/

console.log("Count to 65536 by 2s");
var i = 2;
while (i < 131072) {
	console.log('The answer = ' + i);
    i=i*2;
}

//*****************************************

console.log("Count to 100 by 2s");
var num = 0;

while (num <100) {
	num = num + 2;
	console.log(num);
}
	
//*****************************************
console.log("Challenge 1: Log 1 to 100, display only odds");

i = 1;
while (i < 100) {
   
    console.log('The answer = ' + i);
   	 i+=2; //i=i+2
}
	
//*****************************************
console.log("Challenge 2: Log 1 to 100, display only evens");

for (i = 2; i <=100; i++) {
	if (i%2 == 0){
		console.log("The even number is : "+i);
	} 
}

//*****************************************
console.log("Challenge 3: Log 100 to 1, display only evens");

for (i = 100; i > 1 ; i--) {
	if (i%2 == 0){
		console.log("The even number is : "+i);
	} 
}

//*****************************************
console.log("Challenge 4: Log 100 to 1, display only odds");

for (i = 100; i > 0 ; i--) {
	if (i%2 == 1) {
		console.log("The even number is : "+i);
	} 
}

//*****************************************
console.log("Challenge 5: Log 1 to 100, display every other even");

for (i = 2; i < 100;) {
	if (i%2 == 0) {
		console.log("The even number is : "+i);
			i=i+4;
		
	} 
}
//*****************************************
console.log("Challenge 6: Log 1 to 100, display every other odd");

for (i = 1; i < 100;) {
	if (i%2 == 1) {
		console.log("The even number is : "+i);
			i=i+4;
	} 
}

//*****************************************
console.log("Challenge 7: Log 100 to 1, display every other odd");

for (i = 100; i > 0; i--) {
	if (i%2 == 1) {
		console.log("The even number is : "+i);
		i = i-3;
	} 
} 
//*****************************************
console.log("Challenge 8: Log 100 to 1, display every other even");

for (i = 100; i > 0;  ) {
	if (i%2 == 0) {
		console.log("The even number is : "+i);
		i = i-4;
	} 
} 

//*****************   FIZZBUZZ ************************

/*
* start at 1, end at 100
* multiples of 3, out put the string "Fizz"
* multiples of 5, out put the string "Buzz"
* multiples of 3 and 5 , out put the string "FizzBuz"
* if number is NOT divisible by 3 or 5, output that number
*/

console.log("FIZZ BUZZ");

for (i = 1; i <= 100; i++) {
	if (i%3 == 0 && i%5 !=0) {
		console.log("Fizz");
	} else if (i%5 == 0 && i%3 != 0){
		console.log("Buzz");
	} else if (i%5 == 0 && i%3 == 0){
		console.log("FizzBuzz");
	} else {
		console.log(i);
	}
} 






