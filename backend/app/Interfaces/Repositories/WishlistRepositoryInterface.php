<?php

namespace App\Interfaces\Repositories;

interface WishlistRepositoryInterface
{
    public function getUserWishlists($userId, $page = 1, $perPage = 20);

    public function addToWishlist($userId, $productId);

    public function removeFromWishlist($userId, $productId);

    public function isInWishlist($userId, $productId);

    public function clearWishlist($userId);
}
