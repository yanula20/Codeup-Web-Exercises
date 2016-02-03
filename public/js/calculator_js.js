<script src="/js/jquery-1.12.0.js"></script>
	"use strict;"


	// $(document).ready(function() {
    // alert( 'The DOM has finished loading!' );
    var num = "";
    var mathOperator = "";
    
    var firstOperand = $("#first-operand").val();
    var secondOperand = $("#second-operand").val();
    var mathOperator = $("input#operator").val();


	if ($("input#operator").val() == ""){
		console.log('empty');
		var firstOperand = $("#first-operand").val();
	} 
   
   /**************  math operations ***************/
		$("button#add.calc-button").click(function() {
 		mathOperator = "+"
		$("input#operator").val(mathOperator); 
		if ($("input#operator").val() != "") {
		console.log('full');
		firstOperand  =  $("#second-operand").val();
	} 
		
	});


	 $("button#subtract.calc-button").click(function() {
		mathOperator = "-"
		$("input#operator").val(mathOperator); 
		if ($("input#operator").val() != "") {
		console.log('full');
		firstOperand  =  $("#second-operand").val();
	} 
	

	});  //end button
	
	 $("button#multiply.calc-button").click(function(num) {
		mathOperator = "X"
		$("input#operator").val(mathOperator); 
		if ($("input#operator").val() != "") {
		console.log('full');
		firstOperand  =  $("#second-operand").val();
	} 
	}); //end button
	

	 $("button#divide.calc-button").click(function(num) {
		mathOperator = "/"
		$("input#operator").val(mathOperator); 
		if ($("input#operator").val() != "") {
		console.log('full');
		firstOperand  =  $("#second-operand").val();
		
	} 
	}); //end button

    /************** calculate ***************/
	$("#calculate").click(function(){
		var firstOperand = $("#first-operand").val();
		console.log(firstOperand);
		var secondOperand = $("#second-operand").val();
		console.log(secondOperand);
		var operator = $("#operator").val();
		console.log(operator);
	});
    
    /************** clear ***************/
		$("#clear").click(function(){
			num = "";
			$("#first-operand").val(num); 
			$("#second-operand").val(num);
			$("#operator").val(num);
		});

	 /************** document scope ***************/
	$(document).ready(function(){
		$("#one").click(function(){
			num = num + value;
			$("#first-operand").val(num); 
		});
		$("#two").click(function(){
			num = num + value;
			$("#first-operand").val(num); 
		});
		$("#three").click(function(){
			num = num + value;num = num + value;
			$("#first-operand").val(num); 
		});
		$("#four").click(function(){
			num = num + value;
			$("#first-operand").val(num); 
		});
		$("#five").click(function(){
			num = num + value;
			$("#first-operand").val(num); 
		});
		$("#six").click(function(){
			num = num + value;
			$("#first-operand").val(num); 
		});
		$("#seven").click(function(){
			num = num + value;
			$("#first-operand").val(num); 
		});
		$("#eight").click(function(){
			num = num + value;
			$("#first-operand").val(num); 
		});
		$("#nine").click(function(){
			num = num + value;
			$("#first-operand").val(num); 
		});
		$("#zero").click(function(){
			num = num + value;
			$("#first-operand").val(num); 
		});

		$("#decimal").click(function(){
			console.log(num);
			if (num = "") {
			num = "0.";
			$("#first-operand").val(num);
			// num = "0."
			} if (num = "0.") {
			num = "0.";
			$("#first-operand").val(num);
			} else if (num != "") {
				console.log(num);
			num = num + ".";
			$("#first-operand").val(num);
			} 
		
		});

		


	});      //document ready
  
	 

	// })();