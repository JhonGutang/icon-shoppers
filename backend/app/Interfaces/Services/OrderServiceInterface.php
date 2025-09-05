<?php

namespace App\Interfaces\Services;

interface OrderServiceInterface
{
    public function getOrders($status, $shopId);
    public function updateOrderStatus($status, $shopId);
}
