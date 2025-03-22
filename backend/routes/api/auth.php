<?php

use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [ShopController::class, 'login']);
Route::post('/register', [ShopController::class, 'create' ]);

Route::middleware('auth:shop-api')->group(function () {
    Route::delete('/logout', [ShopController::class,'logout']);
});

?>