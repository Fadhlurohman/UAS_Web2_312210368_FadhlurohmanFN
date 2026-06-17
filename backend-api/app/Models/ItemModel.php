<?php

namespace App\Models;

use CodeIgniter\Model;

class ItemModel extends Model
{
    protected $table = 'items';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'category_id',
        'supplier_id',
        'item_name',
        'stock'
    ];
}