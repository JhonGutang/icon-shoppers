<?php

use App\Http\Controllers\CustomerController;
use Illuminate\Support\Facades\Route;


Route::middleware('auth:customer-api')->group(function () {
    Route::post('order/{id}',[CustomerController::class, 'addToCart']);
    Route::patch('checkout', [CustomerController::class, 'checkoutOrder']);
    Route::get('from-cart',[CustomerController::class, 'fetchAllPendings']);
    Route::get('to-checkout',[CustomerController::class, 'fetchPendingProductForCheckout']);
    Route::delete('order/{id}',[CustomerController::class, 'removeToCart']);
});

?>