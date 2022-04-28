<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('login');
});

Route::get('/display/{vue_capture?}', function () {
    return view('welcome');
})->where('vue_capture', '[\/\w\.-]*')->middleware('auth');

Route::prefix('data')->group(function () {
    Route::prefix('product')->group(function () {
        Route::get('/', 'App\Http\Controllers\ProductController@getAllProducts');
        Route::get('/{id}', 'App\Http\Controllers\ProductController@getProductById');
        Route::post('/', 'App\Http\Controllers\ProductController@addProduct');
        Route::put('/{id}', 'App\Http\Controllers\ProductController@update');
    });

    Route::prefix('cart')->group(function () {
        Route::get('/', 'App\Http\Controllers\CartController@getAllCarts');
        Route::post('/', 'App\Http\Controllers\CartController@addProductToCart');
        Route::delete('/{id}', 'App\Http\Controllers\CartController@delete');
        Route::put('/{id}', 'App\Http\Controllers\CartController@updateCart');
        Route::get('/product/{id}', 'App\Http\Controllers\CartController@getCartByProduct');
    });
});
