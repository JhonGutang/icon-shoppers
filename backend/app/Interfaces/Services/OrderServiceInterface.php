<?php

namespace App\Interfaces\Services;

interface OrderServiceInterface
{
    public function getOrders($status, $shopId);
}
