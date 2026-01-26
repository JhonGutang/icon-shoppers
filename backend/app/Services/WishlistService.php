<?php

namespace App\Services;

use App\Interfaces\Services\WishlistServiceInterface;
use App\Interfaces\Repositories\WishlistRepositoryInterface;

class WishlistService implements WishlistServiceInterface
{
    protected $wishlistRepository;

    public function __construct(WishlistRepositoryInterface $wishlistRepository)
    {
        $this->wishlistRepository = $wishlistRepository;
    }

    public function getUserWishlist($userId, $page = 1, $perPage = 20)
    {
        return $this->wishlistRepository->getUserWishlist($userId, $page, $perPage);
    }

    public function addToWishlist($userId, $productId)
    {
        return $this->wishlistRepository->addToWishlist($userId, $productId);
    }

    public function removeFromWishlist($userId, $productId)
    {
        return $this->wishlistRepository->removeFromWishlist($userId, $productId);
    }

    public function toggleWishlist($userId, $productId)
    {
        if ($this->wishlistRepository->isInWishlist($userId, $productId)) {
            $this->wishlistRepository->removeFromWishlist($userId, $productId);
            return ['status' => 'removed', 'message' => 'Product removed from wishlist'];
        }

        $this->wishlistRepository->addToWishlist($userId, $productId);
        return ['status' => 'added', 'message' => 'Product added to wishlist'];
    }
}
