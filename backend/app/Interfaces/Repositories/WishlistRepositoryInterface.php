<?php

namespace App\Interfaces\Repositories;

interface WishlistRepositoryInterface
{
    public function getUserWishlists($userId);
    public function addToWishlist($userId, $productId);
    public function removeFromWishlist($userId, $productId);
    public function isInWishlist($userId, $productId);
    public function clearWishlist($userId);
}
