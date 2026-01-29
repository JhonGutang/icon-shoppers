<?php

namespace App\Repositories;

use App\Interfaces\Repositories\WishlistRepositoryInterface;
use App\Models\Wishlist;

class WishlistRepository implements WishlistRepositoryInterface
{
    protected $model;

    public function __construct(Wishlist $wishlist)
    {
        $this->model = $wishlist;
    }

    public function getUserWishlists($userId, $page = 1, $perPage = 20)
    {
        return $this->model
            ->where('user_id', $userId)
            ->with(['product.shop', 'product.category'])
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function addToWishlist($userId, $productId)
    {
        return $this->model->firstOrCreate([
            'user_id' => $userId,
            'product_id' => $productId,
        ]);
    }

    public function removeFromWishlist($userId, $productId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->delete();
    }

    public function isInWishlist($userId, $productId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->exists();
    }

    public function clearWishlist($userId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->delete();
    }
}
