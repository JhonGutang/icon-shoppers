<?php

namespace App\Interfaces\Services;

interface ShopServiceInterface
{
    public function getAll($searchParam);
    public function getShop($shopName);
    public function createShop(array $data);
}
