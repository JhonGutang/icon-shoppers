<?php

use App\Http\Controllers\CustomerController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:customer-api')->group(function () {
    Route::post('order/{id}',[CustomerController::class, 'addToCart']);
    Route::get('from-cart',[CustomerController::class, 'fetchAllPendings']);
    Route::delete('order/{id}',[CustomerController::class, 'removeToCart']);
});

?>