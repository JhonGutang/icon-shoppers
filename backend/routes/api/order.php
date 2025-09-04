<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;

Route::get('/orders', [OrderController::class, 'getOrders']);

Route::middleware('auth:shop-api')->group(function () {
    Route::get('/orders', [OrderController::class, 'getOrders']);
    Route::put('/orders/{id}/approve', [OrderController::class, 'approve']);
    Route::put('/orders/{id}/reject', [OrderController::class, 'reject']);
});

// Shared status update route for both customers and sellers
Route::middleware(['auth:shop-api,customer-api'])->group(function () {
    Route::put('status-update/{id}', [OrderController::class, 'statusUpdate']);
});

Route::middleware('auth:customer-api')->group(function () {
    Route::post('order/{id}',[OrderController::class, 'addToCart']);
    Route::patch('checkout', [OrderController::class, 'checkoutOrder']);
    Route::get('/customer/orders', [OrderController::class, 'getCustomersOrders']);
    Route::put('/orders/{id}/receive', [OrderController::class, 'receive']);
});