<?php

namespace App\Interfaces\Repositories;

interface ShopRepositoryInterface
{
    public function getAllShops($searchParam);
    public function getSpecificShop($shopName);
    public function create(array $data);
    public function getAnalytics($shopId);
    public function update(array $data, int $shopId);
}
