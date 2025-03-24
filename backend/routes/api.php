<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ShopController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
require __DIR__.'/api/product.php';
require __DIR__.'/api/auth.php';


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::middleware('auth:shop-api')->group(function () {
    Route::get('/profile', [ShopController::class, 'index']);
});

Route::middleware('auth:customer-api')->group(function () {
    Route::get('/customer-profile', [CustomerController::class, 'index']);
});