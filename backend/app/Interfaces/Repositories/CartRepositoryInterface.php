<?php

namespace App\Interfaces\Repositories;

interface CartRepositoryInterface
{
    public function create(int $userId, int $productId);

    public function getItems(int $userId);

    public function getCartWithItems(int $userId, int $productId);

    public function removeItems($cartWithItems);
}
