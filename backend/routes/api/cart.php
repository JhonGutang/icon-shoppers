<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('to-checkout',[CartController::class, 'index']);
    Route::post('cart/{id}',[CartController::class, 'store']);
    Route::delete('cart-item/{id}',[CartController::class, 'delete']);
});