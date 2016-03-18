<?php


class Log{

	public $filename; 

	public $handle;

	public $date;


	public function __construct($prefix = 'log-'){


	 	$this->date = date("Y-m-d");

        $this->filename = '../logs/' . $prefix . $this->date . '.log';

		$this->handle = fopen($this->filename, 'a');

	   
    }


	public function logMessage($logLevel, $message){

	    fwrite($this->handle, date("Y-m-d,h:m:s") . ' ' . $logLevel . ' ' . $message . PHP_EOL);
	    
	
	}


	public function logInfo($message){

		$this->logMessage("INFO", $message);

	}




	function logError($message){


		$this->logMessage("ERROR", $message);

	}




    public function __destruct(){


	    fclose($this->handle);


    }
	
}



?>