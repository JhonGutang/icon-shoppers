<?php

namespace App\Interfaces\Services;

interface OrderServiceInterface
{
    public function getOrders($status, $shopId);
    public function updateOrderStatus($statusId, $shopId);
    public function getCustomerOrders($status, $customerId);
    public function checkoutOrder($customerId, $productsFromRequest, $productIds);
}
