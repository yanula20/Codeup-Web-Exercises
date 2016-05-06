<?php

// __DIR__ is a *magic constant* with the directory path containing this file.
// This allows us to correctly require_once Model.php, no matter where this file is being required from.
require_once __DIR__ . '/Model.php';
// require_once '../Input.php';

$attributes = array();



class User extends Model{

    protected static $table = 'user';
    /** Insert a new entry into the database */
    protected function insert(){
        $stmt = self::$dbc->prepare("INSERT INTO " . static::$table . " (first_name,last_name,email,password) VALUES (:first_name,:last_name,:email,:password)"); 
        $stmt->bindValue(':first_name', $this->attributes['first_name'], PDO::PARAM_STR);
        $stmt->bindValue(':last_name', $this->attributes['last_name'], PDO::PARAM_STR);
        $stmt->bindValue(':email', $this->attributes['email'], PDO::PARAM_STR);
        $stmt->bindValue(':password', $this->attributes['password'], PDO::PARAM_STR);
        $stmt->execute();

        $id = self::$dbc->lastInsertId();

        $this->attributes['id']= $id;

        return $id;
     
    }

        // @TODO: Use prepared statements to ensure data security

        // @TODO: You will need to iterate through all the attributes to build the prepared query

        // @TODO: After the insert, add the id back to the attributes array
        //        so the object properly represents a DB record


    /** Update existing entry in the database */
    protected function update(){


            self::dbConnect();

            $stmt = self::$dbc->prepare("UPDATE user SET (first_name=:first_name,last_name=:last_name,email=:email,password=:password) WHERE id=:id") ; 

            foreach ($this->attributes as $key=>$value) {

                //":$key" refers to column name
                $stmt->bindValue(":$key", $value, PDO::PARAM_STR);


            }
    

             $stmt->execute();
    }
        // @TODO: Use prepared statements to ensure data security

        // @TODO: You will need to iterate through all the attributes to build the prepared query
   

    /**
     * Find a single record in the DB based on its id
     *
     * @param int $id id of the user entry in the database
     *
     * @return User An instance of the User class with attributes array set to values from the database
     */
    public static function find($id){

        // Get connection to the database
        self::dbConnect();

        $stmt = self::$dbc->prepare('SELECT * FROM user WHERE id = :id');

        $stmt->bindValue(':id', $id , PDO::PARAM_INT);

        //execute gets its own line, t or false
        $stmt->execute();

        $result=$stmt->fetch(PDO::FETCH_ASSOC);

        // @TODO: Create select statement using prepared statements

        // @TODO: Store the result in a variable named $result

        // The following code will set the attributes on the calling object based on the result variable's contents
        $instance = null;
        if ($result) {
            $instance = new static($result);
        }
        return $instance;
    }

    /**
     * Find all records in a table
     *
     * @return User[] Array of instances of the User class with attributes set to values from database
     */
    public static function all(){

        self::dbConnect();

        $stmt = self::$dbc->prepare("SELECT * FROM user");

        $stmt->execute();

        $resultsAll = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $resultsAll;

        // @TODO: Learning from the find method, return all the matching records
    }



    public static function delete($id){

        self::dbConnect();

        $stmt = self::$dbc->prepare("DELETE FROM user WHERE id = :id");

        $stmt->bindValue(':id', $id , PDO::PARAM_INT);

        //execute gets its own line, t or false
        $stmt->execute();


    }
}
