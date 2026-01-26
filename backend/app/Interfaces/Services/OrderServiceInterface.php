<?php

namespace App\Interfaces\Services;

interface OrderServiceInterface
{
    public function getOrders($status, $shopId, $page = 1, $perPage = 20);
    public function updateOrderStatus($status, $orderId);
    public function getCustomerOrders($status, $userId, $page = 1, $perPage = 20);
    public function checkoutOrder($userId, $productsFromRequest, $productIds, array $data = []);
    public function getOrderDetails($orderNumber);
    public function cancelOrder($orderId, $reason);
}
