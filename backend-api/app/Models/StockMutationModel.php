<?php

namespace App\Models;

use CodeIgniter\Model;

class StockMutationModel extends Model
{
    protected $table = 'stock_mutations';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'item_id',
        'type',
        'quantity',
        'notes',
        'created_at'
    ];
}
