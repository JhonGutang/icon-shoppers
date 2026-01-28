<?php

namespace App\Repositories;

use App\Interfaces\Repositories\ShopRepositoryInterface;
use App\Models\Shop;

class ShopRepository implements ShopRepositoryInterface
{

    public function getAllShops($filters = []) {
        $searchParam = $filters['search'] ?? $filters['query'] ?? null;
        $sortBy = $filters['sort'] ?? $filters['sort_by'] ?? 'created_at';
        
        $query = Shop::where('status', Shop::STATUS_ACTIVE)
            ->when($searchParam, function ($query) use ($searchParam) {
                $query->where('name', 'like', "%{$searchParam}%");
            });

        switch ($sortBy) {
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'popular':
                // Assuming popularity based on orders count
                $query->withCount('orders')->orderBy('orders_count', 'desc');
                break;
            case 'rating':
                // Assuming ratings are aggregatable
                $query->orderBy(
                    \App\Models\ProductRating::selectRaw('avg(rating)')
                        ->whereIn('product_id', Shop::select('id')->whereColumn('shops.id', 'product_ratings.product_id')), // This might be complex, simplified for now
                    'desc'
                );
                // Better approach: use a helper or specific column if exists, 
                // but let's stick to creation for now if complex.
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        return $query->paginate(12);
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
