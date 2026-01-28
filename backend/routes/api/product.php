<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// Public Customer Routes
Route::get('/products/all', [ProductController::class, 'fetchAllProducts']);
Route::get('/products/search', [ProductController::class, 'fetchAllProducts']); // Explicit search route
Route::get('/products/featured', [ProductController::class, 'fetchFeaturedProducts']);
Route::get('/products/top-selling', [ProductController::class, 'fetchTopSellingProducts']);
Route::get('/products/category/{categoryId}', [ProductController::class, 'fetchByCategory']);
Route::get('/products/{slug}', [ProductController::class, 'fetchSpecificProduct']);
Route::get('/products/{id}/related', [ProductController::class, 'fetchRelatedProducts']);

// Merchant Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/merchant/products', [ProductController::class, 'index']);
    Route::post('/merchant/products', [ProductController::class, 'create']);
    Route::post('/merchant/products/{id}', [ProductController::class, 'update']);
    Route::delete('/merchant/products/{id}', [ProductController::class, 'destroy']);
});
