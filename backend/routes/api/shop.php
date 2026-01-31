<?php

use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::get('/shops', [ShopController::class, 'getAllShops']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/shops', [ShopController::class, 'create']);
    Route::post('/shops/delete', [ShopController::class, 'destroy']);
    Route::get('/shop/analytics', [ShopController::class, 'getAnalytics']);
});

Route::get('/shop/{name}', [ShopController::class, 'getSpecificShop']);
