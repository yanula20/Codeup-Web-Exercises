<?php

class Automobile
{

    public $make;
    public $model;
    public $color;
    public $miles;

    public function __construct($make, $model, $color)
    {
        $this->make = $make;
        $this->model = $model;
        $this->color = $color;
    }

    public function getDescription()
    {
        return $this->color . " ". $this->make . " " . $this->model;
    }

    public function save()
    {
        // turn object into a string
        // write the string to a file

    }

    public function __destruct()
    {
        echo "The Automobile object was destroyed";
    }

}
