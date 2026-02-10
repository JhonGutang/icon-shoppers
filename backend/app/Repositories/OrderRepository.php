<?php

namespace App\Repositories;

use App\Interfaces\Repositories\OrderRepositoryInterface;
use App\Models\Order;
use App\Models\OrderItem;

class OrderRepository implements OrderRepositoryInterface
{
    public function all($status, $shopId, $page = 1, $perPage = 20)
    {
        $orders = Order::with([
            'user',
            'orderItems.product',
        ])
            ->where('shop_id', $shopId)
            ->when($status && $status !== 'ALL', function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return $orders;
    }

    public function update($status, $orderId)
    {
        $order = Order::findOrFail($orderId);
        $order->update([
            'status' => $status,
        ]);

        return $order;
    }

    public function getCustomersOrder($status, $userId, $page = 1, $perPage = 20)
    {
        $orders = Order::with([
            'orderItems.product:id,name,price,shop_id,image',
            'orderItems.product.shop:id,name,description',
        ])
            ->where('user_id', $userId)
            ->when($status && $status !== 'ALL', function ($query) use ($status) {
                if ($status === 'completed') {
                    $query->whereIn('status', ['completed', 'received']);
                } else {
                    $query->where('status', $status);
                }
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return $orders;
    }

    public function saveOrder($userId, $shopId, array $additionalData = [])
    {
        $order = Order::create([
            'user_id' => $userId,
            'shop_id' => $shopId,
            'status' => Order::STATUS_ORDERED,
            'total_amount' => $additionalData['total_amount'] ?? 0,
            'subtotal' => $additionalData['subtotal'] ?? 0,
            'shipping_fee' => $additionalData['shipping_fee'] ?? 0,
            'payment_status' => Order::PAYMENT_STATUS_PENDING,
            'payment_method' => $additionalData['payment_method'] ?? 'COD',
            'delivery_method' => $additionalData['delivery_method'] ?? null,
            'shipping_address' => $additionalData['shipping_address'] ?? null,
            'notes' => $additionalData['notes'] ?? null,
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

    public function getOrderByNumber($orderNumber)
    {
        return Order::with([
            'user',
            'shop',
            'orderItems.product.shop',
        ])
            ->where('order_number', $orderNumber)
            ->firstOrFail();
    }

    public function cancelOrder($orderId, $reason)
    {
        $order = Order::findOrFail($orderId);
        $order->update([
            'status' => Order::STATUS_CANCELLED,
            'notes' => $order->notes."\nCancellation Reason: ".$reason,
        ]);

        return $order;
    }
}
