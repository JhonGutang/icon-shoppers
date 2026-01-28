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

    public function getAnalytics($shopId)
    {
        $shop = Shop::findOrFail($shopId);
        
        $totalRevenue = $shop->orders()
            ->where('status', \App\Models\Order::STATUS_DELIVERED)
            ->sum('total_amount');
            
        $pendingOrders = $shop->orders()
            ->where('status', \App\Models\Order::STATUS_ORDERED)
            ->count();
            
        $totalProducts = $shop->products()->count();
        
        $totalOrders = $shop->orders()->count();
        
        // Average rating calculation across all products of the shop
        $averageRating = \App\Models\ProductRating::whereIn('product_id', $shop->products()->pluck('id'))
            ->avg('rating') ?: 0;

        return [
            'total_revenue' => (float) $totalRevenue,
            'pending_orders' => $pendingOrders,
            'total_products' => $totalProducts,
            'total_orders' => $totalOrders,
            'average_rating' => round((float) $averageRating, 1),
        ];
    }

    public function update(array $data, int $shopId)
    {
        $shop = Shop::findOrFail($shopId);
        $shop->update($data);
        return $shop;
    }
}
