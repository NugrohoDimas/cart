<?php

namespace App\Repositories;

use App\Models\Product;

class ProductRepository
{
    protected $product;

    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    public function getAll(): Object
    {
        return $this->product->get();
    }

    public function store($data)
    {
        $newData = new $this->product;
        $newData->name = $data['name'];
        $newData->price = $data['price'];
        $newData->description = $data['description'];
        $newData->stock = $data['stock'];
        $newData->save();
        return $newData->fresh();
    }

    public function update($id, $data)
    {
        return Product::where('_id', $id)->update($data, ['upsert' => true]);
    }

    public function getProductById($id)
    {
        return Product::where('_id', $id)->get();
    }
}
