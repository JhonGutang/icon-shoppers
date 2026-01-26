<?php

namespace App\Interfaces\Services;

interface WishlistServiceInterface
{
    public function getUserWishlist($userId, $page = 1, $perPage = 20);
    public function addToWishlist($userId, $productId);
    public function removeFromWishlist($userId, $productId);
    public function toggleWishlist($userId, $productId);
}
