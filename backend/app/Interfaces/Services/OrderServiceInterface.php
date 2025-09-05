<?php

namespace App\Interfaces\Services;

interface OrderServiceInterface
{
    public function getOrders($statusId, $shopId);
    public function updateOrderStatus($statusId, $shopId);
}
