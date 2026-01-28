<?php

namespace App\Interfaces\Services;

interface ShopServiceInterface
{
    public function getAll($filters = []);

    public function getShop($shopName);

    public function createShop(array $data);

    public function getAnalytics($shopId);

    public function updateShop(array $data, int $shopId);
}
