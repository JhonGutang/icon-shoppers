<?php

use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // Seller Routes
    Route::get('/seller/orders', [OrderController::class, 'getOrders']);
    Route::put('/orders/{id}/status', [OrderController::class, 'statusUpdate']);

    // Customer Routes
    Route::get('/customer/orders', [OrderController::class, 'getCustomersOrders']);
    Route::post('/checkout', [OrderController::class, 'checkoutOrder']);
    Route::get('/orders/{orderNumber}', [OrderController::class, 'show']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);
});
