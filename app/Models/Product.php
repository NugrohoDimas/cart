<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class Product extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'product';

    protected $fillable = ['stock', 'name', 'price', 'description'];

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }
}
