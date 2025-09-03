<?php

namespace App\Repositories;

use App\Interfaces\Repositories\ShopRepositoryInterface;
use App\Models\Shop;

class ShopRepository implements ShopRepositoryInterface
{

    public function getAllShops ($searchParam) {
        return $searchParam ? Shop::where('name', 'like', "%{$searchParam}%")->get() : Shop::all();
    }

    public function getSpecificShop ($shopName) {
        return Shop::with('products')->where('name', $shopName)->firstOrFail();
    }
}
