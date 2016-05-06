<?php


class Log{

	protected $filename; 

	private $handle;

	private $date;


	public function __construct($prefix = 'log-'){


	 	$this->date = date("Y-m-d");

        $this->setFileName($prefix);

		$this->handle = fopen($this->filename, 'a');

	   
    }

    private function setFileName($prefix){

    	//does specific file exist, if not create it, update the 
    	touch('../logs/' . $prefix . $this->date . '.log');

    	//check to see if I can WRITE to that existing file
		if(is_writable('../logs/' . $prefix . $this->date . '.log')){

			$this->filename = '../logs/' . $prefix . $this->date . '.log';


		} else{

			echo "Cannot write to file." . PHP_EOL;
			die();
		} 	
    	


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