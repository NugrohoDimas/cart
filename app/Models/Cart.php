<?php

namespace App\Models;

use Jenssegers\Mongodb\Eloquent\Model;

class Cart extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'cart';

    protected $fillable = ['name', 'price', 'quantity'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
