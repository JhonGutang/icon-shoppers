<?php

namespace App\Repositories;

use App\Interfaces\Repositories\OrderRepositoryInterface;
use App\Models\Order;

class OrderRepository implements OrderRepositoryInterface
{
    public function all($statusId, $shopId)
    {
        $orders = Order::with([
            'customer',
            'orderStatus',
            'orderItems.product',
            'orderItems.product.shop'
        ])
            ->whereHas('orderItems.product', function ($query) use ($shopId) {
                $query->where('shop_id', $shopId);
            })
            ->when($statusId && $statusId !== 1, function ($query) use ($statusId) {
                $query->where('status_id', $statusId);
            })
            ->get();

        return $orders;
    }

    public function update($statusId, $shopId)
    {
        $order = Order::findOrFail($shopId);
        $order->update([
            'status_id' => $statusId
        ]);

        return $order;
    }

    public function getCustomersOrder($statusId, $customerId)
    {
        $orders = Order::with([
                'orderItems.product:id,name,price,shop_id,image',
                'orderItems.product.shop:id,name,email,description,contact_number',
                'orderStatus:id,status'
            ])
            ->where('customer_id', $customerId)
            ->when($statusId && $statusId !== 0, function ($query) use ($statusId) {
                $query->where('status_id', $statusId);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return $orders;
    }
}
