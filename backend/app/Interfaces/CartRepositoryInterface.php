<?php

namespace App\Interfaces;

interface CartRepositoryInterface
{
    /**
     * Create a new cart.
     *
     * @param array $data
     * @return mixed
     */
    public function create(int $userId, int $productId);
}
