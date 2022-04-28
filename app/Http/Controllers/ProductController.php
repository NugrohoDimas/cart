<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    public function getAllProducts() : JsonResponse
    {
        try {
            $result = $this->productService->getAll();
        } catch (Exception $exception) {
            $result = [
                'status' => 500,
                'error' => $exception->getMessage()
            ];
        }
        return response()->json($result);
    }

    public function getProductById($id)
    {
        return $this->productService->getProductById($id);
    }

    public function addProduct(Request $request)
    {
        $data = $request->only(['name', 'description', 'stock', 'price']);

        $result = ['status' => 201];

        try {
            $result['data'] = $this->productService->store($data);
        } catch (\Exception $exception) {
            $result = [
                'status' => 422,
                'error' => $exception->getMessage()
            ];
        }

        return response()->json($result, $result['status']);
    }

    public function update($id, Request $request)
    {
        $data = $request->only(['name', 'description', 'stock', 'price']);

        $result = ['status' => 201];

        try {
            $this->productService->update($id, $data);
            $data['_id'] = $id;
            $result['data'] = $data;
        } catch (Exception $exception) {
            $result = [
                'status' => 422,
                'error' => $exception->getMessage()
            ];
        }

        return response()->json($result, $result['status']);
    }
}
