<?php

use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

require __DIR__.'/api/product.php';
require __DIR__.'/api/auth.php';
require __DIR__.'/api/order.php';
require __DIR__.'/api/shop.php';
require __DIR__.'/api/cart.php';
require __DIR__.'/api/rating.php';
require __DIR__.'/api/wishlist.php';
require __DIR__.'/api/category.php';
require __DIR__.'/api/address.php';
require __DIR__.'/api/chat.php';

use Illuminate\Support\Facades\Broadcast;

Broadcast::routes(['middleware' => ['api', 'auth:sanctum']]);

Route::middleware('auth:sanctum')->group(function () {
    // Profile Management (Unified)
    Route::get('/profile', [ShopController::class, 'index']); // For merchants
    Route::post('/profile', [ShopController::class, 'update']);
});
