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
require __DIR__.'/api/notification.php';

use Illuminate\Support\Facades\Broadcast;

Broadcast::routes(['middleware' => ['api', 'auth:sanctum']]);

Route::middleware('auth:sanctum')->group(function () {
    // Profile Management (Unified)
    Route::get('/profile', [ShopController::class, 'index']); // For merchants
    Route::post('/profile', [ShopController::class, 'update']);
});

Route::get('/debug-broadcast', function () {
    return [
        'broadcast_connection' => config('broadcasting.default'),
        'reverb_key' => config('broadcasting.connections.reverb.key'),
        'reverb_host' => config('broadcasting.connections.reverb.options.host'),
        'env_broadcast_conn' => env('BROADCAST_CONNECTION'),
        'app_url' => config('app.url'),
    ];
});
