<?php

namespace App\Repositories;

use App\Interfaces\Repositories\ShopRepositoryInterface;
use App\Models\Shop;

class ShopRepository implements ShopRepositoryInterface
{

    public function getAllShops ($searchParam) {
        return Shop::where('status', Shop::STATUS_ACTIVE)
            ->when($searchParam, function ($query) use ($searchParam) {
                $query->where('name', 'like', "%{$searchParam}%");
            })->get();
    }

    public function getSpecificShop ($shopName) {
        return Shop::with('products')
            ->where('name', $shopName)
            ->where('status', Shop::STATUS_ACTIVE)
            ->firstOrFail();
    }

    public function createShop(array $data)
    {
        return Shop::create($data);
    }

    public function findByOwner($ownerId)
    {
        return Shop::where('owner_id', $ownerId)->first();
    }
}
