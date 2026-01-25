<?php

namespace App\Repositories;

use App\Interfaces\Repositories\OrderRepositoryInterface;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;

class OrderRepository implements OrderRepositoryInterface
{
    public function all($status, $shopId)
    {
        $orders = Order::with([
            'user',
            'orderItems.product',
        ])
            ->where('shop_id', $shopId)
            ->when($status && $status !== 'ALL', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->get();

        return $orders;
    }

    public function update($status, $orderId)
    {
        $order = Order::findOrFail($orderId);
        $order->update([
            'status' => $status
        ]);

        return $order;
    }

    public function getCustomersOrder($status, $userId)
    {
        $orders = Order::with([
                'orderItems.product:id,name,price,shop_id,image',
                'orderItems.product.shop:id,name,description',
            ])
            ->where('user_id', $userId)
            ->when($status && $status !== 'ALL', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return $orders;
    }

    public function saveOrder($userId, $shopId, $totalAmount = 0)
    {
        $order = Order::create([
            'user_id' => $userId,
            'shop_id' => $shopId,
            'status' => Order::STATUS_PENDING,
            'total_amount' => $totalAmount,
            'payment_status' => Order::PAYMENT_STATUS_PENDING,
        ]);

        return $order;
    }

    public function saveOrderItems($items)
    {
        return OrderItem::create($items);
    }
    
    public function updateOrderTotalAmount($orderId, $totalAmount)
    {
        $order = Order::findOrFail($orderId);
        $order->update(['total_amount' => $totalAmount]);
    }
    
}
