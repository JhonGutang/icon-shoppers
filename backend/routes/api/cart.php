<?php

use App\Http\Controllers\CartController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('to-checkout', [CartController::class, 'index']);
    Route::post('cart/{id}', [CartController::class, 'store']);
    Route::delete('cart-item/{id}', [CartController::class, 'delete']);
});
