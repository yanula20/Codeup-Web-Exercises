"use strict";

var i = 2;

while (i < 131072) {
	console.log('The answer = ' + i);
    i=i*2;//i is reset on the left of = sign
}


var i = 1;

while (i < 20) {
	console.log('The answer = ' + i);
    i=i+3;//i is reset on the left of = sign
}

console.log('my var experiment below')
var i = 0;
	console.log('My zero =' + i);
	while (++i<=10){
		var c = i*2;
		console.log('Math result =' + c);	
	}
	
	
	
		
  
