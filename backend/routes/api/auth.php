<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [ShopController::class, 'login']);
Route::post('/register', [ShopController::class, 'create' ]);
Route::post('/customer-login', [CustomerController::class, 'login']);
Route::post('/customer-register', [CustomerController::class, 'create']);

Route::middleware('auth:shop-api')->group(function () {
    Route::put('shop/{shop}',[ShopController::class, 'update']);
    Route::delete('/shop-logout', [ShopController::class,'logout']);
});

Route::middleware('auth:customer-api')-> group(function () {
    Route::delete('/customer-logout', [CustomerController::class,'logout']);
});

?>