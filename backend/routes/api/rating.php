<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RatingController;

Route::middleware('auth:customer-api')->group(function () {
    Route::post('/ratings', [RatingController::class, 'store']);
    Route::get('/ratings/{type}/{id}', [RatingController::class, 'getRatings']);
});
