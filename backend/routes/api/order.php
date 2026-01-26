<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/orders', [OrderController::class, 'getOrders']);
}); 

// Shared status update route for both customers and sellers
Route::middleware(['auth:sanctum'])->group(function () {
    Route::put('status-update/{id}', [OrderController::class, 'statusUpdate']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('order/{id}',[OrderController::class, 'addToCart']);
    Route::post('checkout', [OrderController::class, 'checkoutOrder']);
    Route::get('/customer/orders', [OrderController::class, 'getCustomersOrders']);
    Route::put('/orders/{id}/receive', [OrderController::class, 'receive']);
});