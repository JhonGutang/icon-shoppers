<?php

use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::get('/shop/{name}', [ShopController::class, 'getSpecificShop']);
Route::get('/shops', [ShopController::class, 'getAllShops']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/shops', [ShopController::class, 'create']);
});