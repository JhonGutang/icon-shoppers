<?php

namespace App\Interfaces\Repositories;

interface OrderRepositoryInterface
{
    public function all($statusId, $shopId);
    public function update($statusId, $shopId);
    public function getCustomersOrder($statusId, $customerId);
    public function saveOrder($customerId);
    public function saveOrderItems($items);
    public function updateOrderTotalAmount($orderId, $totalAmount);
}
