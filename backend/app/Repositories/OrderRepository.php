<?php

namespace App\Repositories;

use App\Interfaces\Repositories\OrderRepositoryInterface;
use App\Models\Order;

class OrderRepository implements OrderRepositoryInterface
{
    public function all($status, $shopId)
    {
        $orders = Order::with([
            'customer',
            'orderItems.product',
            'orderItems.product.shop'
        ])
        ->whereHas('orderItems.product', function ($query) use ($shopId) {
            $query->where('shop_id', $shopId);
        })
        ->when($status && $status !== 'All', function ($query) use ($status) {
            $query->where('status', $status);
        })
        ->get();

        return $orders;
    }

    public function update($statusId, $shopId) {
        $order = Order::findOrFail($shopId); 
        $order->update([
            'status_id' => $statusId
        ]);

        return $order;
    }
}
