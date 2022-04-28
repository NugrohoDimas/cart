<?php

namespace App\Repositories;

use App\Models\Cart;

class CartRepository
{
    protected Cart $cart;

    public function __construct(Cart $cart)
    {
        $this->cart = $cart;
    }

    public function getCarts()
    {
        return $this->cart->get();
    }

    public function store($cart) : Object
    {
        $newData = new $this->cart;
        $newData->name = $cart['name'];
        $newData->price = $cart['price'];
        $newData->product_id = $cart['product_id'];
        $newData->quantity = 1;
        $newData->save();
        return $newData->fresh();
    }

    public function update($id, $data)
    {
        return Cart::where('_id', $id)->update($data, ['upsert' => true]);
    }

    public function delete($id)
    {
        return Cart::find($id)->delete();
    }

    public function getCartByName($id)
    {
        return Cart::where('product_id', $id)->get();
    }

}
