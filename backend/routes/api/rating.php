<?php

use App\Http\Controllers\ProductRatingController;
use Illuminate\Support\Facades\Route;

Route::get('/product-ratings/{product}', [ProductRatingController::class, 'index']);
Route::middleware('auth:sanctum')->prefix('customer')->group(function () {
    Route::post('/product-ratings', [ProductRatingController::class, 'store']);
});
