<?php

namespace App\Interfaces;

interface CartRepositoryInterface
{
    public function create(int $userId, int $productId);
    public function getItems(int $userId);
    public function getCartWithItems(int $userId, int $productId);
    public function removeItems($cartWithItems);
}
