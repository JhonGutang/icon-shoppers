<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;

Route::middleware('auth:shop-api')->group(function () {
    Route::get('/orders', [OrderController::class, 'getOrders']);
    Route::put('/orders/{id}/approve', [OrderController::class, 'approve']);
    Route::put('/orders/{id}/reject', [OrderController::class, 'reject']);
});

Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
Route::put('/orders/{id}', [OrderController::class, 'update']);
Route::delete('/orders/{id}', [OrderController::class, 'delete']);

Route::middleware('auth:customer-api')->group(function () {
    Route::post('order/{id}',[OrderController::class, 'addToCart']);
    Route::patch('checkout', [OrderController::class, 'checkoutOrder']);
    Route::get('from-cart',[OrderController::class, 'fetchAllPendings']);
    Route::delete('order/{id}',[OrderController::class, 'removeFromCart']);
    Route::get('/customer/orders', [OrderController::class, 'getCustomersOrders']);
});