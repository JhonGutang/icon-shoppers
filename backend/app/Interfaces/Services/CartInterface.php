<?php

namespace App\Interfaces\Services;

interface CartInterface
{

    /**
     * Add a product to the cart.
     *
     * @param int $userId
     * @param int $productId
     * @param int $quantity
     * @return mixed
     */
public function addToCart(int $userId, int $productId);
}
