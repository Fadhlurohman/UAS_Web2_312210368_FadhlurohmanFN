<?php

namespace App\Controllers;

class Test extends BaseController
{
    public function index()
    {
        $db = \Config\Database::connect();

        if ($db) {
            echo "Database Connected";
        }
    }
}