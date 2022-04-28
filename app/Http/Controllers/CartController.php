<?php

namespace App\Http\Controllers;

use App\Services\CartService;
use Exception;
use Illuminate\Http\Request;

class CartController extends Controller
{
    protected CartService $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    public function getAllCarts()
    {
        try {
            $result = $this->cartService->getAll();
        } catch (\Exception $exception) {
            $result = [
                'status' => 500,
                'error' => $exception->getMessage()
            ];
        }
        return response()->json($result);
    }

    public function addProductToCart(Request $request)
    {
        $data = $request->only(['name', 'price', 'product_id']);

        $result = ['status' => 201];

        try {
            $result['data'] = $this->cartService->store($data);
        } catch (\Exception $exception) {
            $result = [
                'status' => 422,
                'error' => $exception->getMessage()
            ];
        }

        return response()->json($result, $result['status']);
    }

    public function updateCart($id, Request $request)
    {
        $data = $request->only(['name', 'quantity','price', 'product_id']);

        $result = ['status' => 201];

        try {
            $this->cartService->update($id, $data);
            $result['data'] = $data;
        } catch (Exception $exception) {
            $result = [
                'status' => 422,
                'error' => $exception->getMessage()
            ];
        }

        return response()->json($result, $result['status']);
    }

    public function delete($id)
    {
        try {
            $result['data'] = $this->cartService->delete($id);
        } catch (\Exception $exception) {
            $result = [
                'status' => 422,
                'error' => $exception->getMessage()
            ];
        }

        return response()->json($result);
    }

    public function getCartByProduct($id)
    {
        return $this->cartService->getCartByName($id);
    }
}
