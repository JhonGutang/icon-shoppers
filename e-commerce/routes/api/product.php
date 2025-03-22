<?php

use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:shop-api')->group(function () {
    Route::post('/product', [ProductController::class, 'create']);
    Route::get('/products', [ProductController::class,'index']);
});
?>