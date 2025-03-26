<?php

use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/all-products', [ProductController::class, 'fetchAllProducts']);
Route::get('/featured-products', [ProductController::class, 'fetchFeaturedProducts']);
Route::get('/product/{id}', [ProductController::class,'fetchSpecificProduct']);

Route::middleware('auth:shop-api')->group(function () {
    Route::get('/products', [ProductController::class,'index']);
    Route::post('/product', [ProductController::class, 'create']);
    Route::patch('/product/{id}', [ProductController::class,'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
});
?>