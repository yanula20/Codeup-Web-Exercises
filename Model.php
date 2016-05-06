<?php

require_once 'db_connect.php';

//abstract = write your methods (only!) on a child class
abstract class Model
{
    /** @var PDO|null Connection to the database */
    protected static $dbc = null;
    protected static $table = 'user';

    /** @var array Database values for a single record. Array keys should be column names in the DB */
    protected $attributes = array();

    /**
     * Constructor
     *
     * An instance of a class derived from Model represents a single record in the database.
     *
     * $param array $attributes Optional array of database values to initialize the model record with
     */
    //alternative below: array $attributes = array()
    public function __construct(array $attributes = array())
    {
        self::dbConnect();
        $this->attributes = $attributes;

        // @TODO: Initialize the $attributes property with the passed value
    }

    /**
     * Connect to the DB
     *
     * This method should be called at the beginning of any function that needs to communicate with the database
     */
    protected static function dbConnect()
    {
        if (!self::$dbc) {

            $dbc = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME,DB_USER,PASSWORD);
            self::$dbc = $dbc;
           
            // @TODO: Connect to database
        }
    }


    public static function all(){

        self::dbConnect();

        $stmt = self::$dbc->prepare('SELECT * FROM user');

        $stmt->execute();

        $resultsAll = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $resultsAll;

    }


    /**
     * Get a value from attributes based on its name
     *
     * @param string $name key for attributes array
     *
     * @return mixed|null value from the attributes array or null if it is undefined
     */
    public function __get($name)
    {

        // Check for existence of array key $name
        if (array_key_exists($name, $this->attributes)) {

            return $this->attributes[$name];
        }

            return null;
        

        // @TODO: Return the value from attributes for $name if it exists, else return null
    }

    /**
     * Set a new value for a key in attributes
     *
     * @param string $name  key for attributes array
     * @param mixed  $value value to be saved in attributes array
     */
    public function __set($name, $value)
    {
       

        // Set the $name key to hold $value in $data
        $this->attributes[$name] = $value;

        
    }


    /** Store the object in the database */
        public function save()
    {

        if(empty($this->attributes)){


            return;
        }

        //alternative if(array_key_exists('id',$this->attributes))
        if(isset($this->attributes['id'])){

            $this->update();

        }else{

            $this->insert();
        }
        // @TODO: Ensure there are values in the attributes array before attempting to save

        // @TODO: Call the proper database method: if the `id` is set this is an update, else it is a insert
    }

    /**
     * Insert new entry into database
     *
     * NOTE: Because this method is abstract, any child class MUST have it defined.
     */
    protected abstract function insert();


    /**
     * Update existing entry in database
     *
     * NOTE: Because this method is abstract, any child class MUST have it defined.
     */
    protected abstract function update();
}
