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

    public function getSpecificShop ($shopSlug) {
        return Shop::with('products')
            ->where('slug', $shopSlug)
            ->where('status', Shop::STATUS_ACTIVE)
            ->first();
    }

    public function create(array $data)
    {
        return Shop::create($data);
    }

    public function findByOwner($ownerId)
    {
        return Shop::where('owner_id', $ownerId)->first();
    }
}
