<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;

Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::put('/orders/{id}', [OrderController::class, 'update']);
Route::delete('/orders/{id}', [OrderController::class, 'delete']);

Route::middleware('auth:shop-api')->group(function () {
    Route::get('/seller/orders', [OrderController::class, 'getSellerOrders']);
});

Route::middleware('auth:customer-api')->group(function () {
    Route::post('order/{id}',[OrderController::class, 'addToCart']);
    Route::patch('checkout', [OrderController::class, 'checkoutOrder']);
    Route::get('from-cart',[OrderController::class, 'fetchAllPendings']);
    Route::get('to-checkout',[OrderController::class, 'fetchPendingProductForCheckout']);
    Route::delete('order/{id}',[OrderController::class, 'removeToCart']);
    Route::get('/customer/orders', [OrderController::class, 'getCustomersOrders']);
});