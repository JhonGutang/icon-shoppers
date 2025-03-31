<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
require __DIR__.'/api/product.php';
require __DIR__.'/api/auth.php';
require __DIR__.'/api/customer.php';
require __DIR__.'/api/order.php';

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::middleware('auth:shop-api')->group(function () {
    Route::get('/profile', [ShopController::class, 'index']);
    Route::get('/seller/orders', [OrderController::class, 'getSellerOrders']);
});

Route::middleware('auth:customer-api')->group(function () {
    Route::get('/customer-profile', [CustomerController::class, 'index']);
});
