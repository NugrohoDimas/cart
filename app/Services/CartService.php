<?php

namespace App\Services;

use App\Repositories\CartRepository;
use http\Exception\InvalidArgumentException;
use Illuminate\Support\Facades\Validator;
use MongoDB\BSON\ObjectId;

class CartService
{
    protected CartRepository $cartRepository;

    public function __construct(CartRepository $cartRepository)
    {
        $this->cartRepository = $cartRepository;
    }

    public function getAll()
    {
        return $this->cartRepository->getCarts();
    }

    public function store($data)
    {
//        $validator = Validator::make($data, [
//            'name' => 'required',
//            'price' => 'required',
//            'quantity' => 'required',
//            'product_id' => 'required'
//        ]);
//
//        if ($validator->fails()) {
//            throw new InvalidArgumentException($validator->errors()->first());
//        }

        return $this->cartRepository->store($data);
    }

    public function update($id, $data)
    {
        $validator = Validator::make($data, [
            'name' => 'required',
            'price' => 'required',
            'product_id' => 'required'
        ]);

        if ($validator->fails()) {
            throw new InvalidArgumentException($validator->errors()->first());
        }

        return $this->cartRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->cartRepository->delete($id);
    }

    public function getCartByName($id)
    {
        return $this->cartRepository->getCartByName($id);
    }
}
