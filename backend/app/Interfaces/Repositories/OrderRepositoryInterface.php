<?php

namespace App\Interfaces\Repositories;

interface OrderRepositoryInterface
{
    public function all($status, $shopId, $page = 1, $perPage = 20);

    public function update($status, $orderId);

    public function getCustomersOrder($status, $userId, $page = 1, $perPage = 20);

    public function saveOrder($userId, $shopId, array $additionalData = []);

    public function saveOrderItems($items);

    public function updateOrderTotalAmount($orderId, $totalAmount);

    public function getOrderByNumber($orderNumber);

    public function cancelOrder($orderId, $reason);
}
