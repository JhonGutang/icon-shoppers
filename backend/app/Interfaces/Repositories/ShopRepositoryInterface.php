<?php

namespace App\Interfaces\Repositories;

interface ShopRepositoryInterface
{
    public function getAllShops($searchParam);
    public function getSpecificShop($shopName);
}
