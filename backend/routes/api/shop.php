<?php

use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;

Route::get('/shop/{name}', [ShopController::class, 'getSpecificShop']);

?>