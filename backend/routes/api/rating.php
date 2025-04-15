<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ShopRatingController;
use App\Http\Controllers\ProductRatingController;

Route::middleware('auth:customer-api')->prefix('customer')->group(function () {
    Route::post('/product-ratings', [ProductRatingController::class, 'store']);
    Route::get('/product-ratings/{product}', [ProductRatingController::class, 'getProductRatings']);

    Route::post('/shop-ratings', [ShopRatingController::class, 'store']);
    Route::get('/shop-ratings/{shop}', [ShopRatingController::class, 'getShopRatings']);
});
