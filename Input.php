<?php

class Input
{

    public static function has($key){

       return isset($_REQUEST[$key]);
        
    }
    
    public static function get($key, $default = null)
    {
        return isset($_REQUEST[$key])? $_REQUEST[$key]: $default;
    }


    public static function escape($input){

        return htmlspecialchars(strip_tags($input));


    }

    public static function getNumber($key){

        $value = self::get($key);

        if(!is_numeric($value) || $value = null){

            throw new Exception('Your input is not a number or null!');

        }
           
            $value = (float)self::get($key);
            return $value;

    }

    public static function getDate($key){
        $value = self::get($key);

        $validDate = date_create($value);

        if($validDate) {
            return $value;
        }else {
            throw new Exception("The input provided is not in a valid date format");
        }
    }
    
    public static function getString($key){

           $value = self::get($key);

          if( ($value == null) || (is_resource($value)) || (is_numeric($value)) || (is_bool($value))
                || (is_array($value)) || (is_object($value)) ){

             throw new Exception('Your input is not a string or null!' . $key);

        }

            
            return $value;
          
   
    }

    ///////////////////////////////////////////////////////////////////////////
    //                      DO NOT EDIT ANYTHING BELOW!!                     //
    // The Input class should not ever be instantiated, so we prevent the    //
    // constructor method from being called. We will be covering private     //
    // later in the curriculum.                                              //
    ///////////////////////////////////////////////////////////////////////////
    private function __construct() {}
}
