<?php

namespace App\DTO;

use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class OrderDTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $order_number,
        public readonly string $user_name,
        public readonly array $products,
        public readonly float $subtotal,
        public readonly float $shipping_fee,
        public readonly float $total_amount,
        public readonly string $status,
        public readonly ?string $shipping_address,
        public readonly string $payment_status,
        public readonly string $payment_method,
        public readonly ?string $delivery_method,
        public readonly ?string $notes,
        public readonly string $created_at
    ) {}

    public static function fromOrder($order): self
    {
        $items = $order->orderItems->map(fn($item) => OrderItemDTO::fromOrderItem($item))->toArray();

        return new self(
            id: (int) $order->id,
            order_number: (string) $order->order_number,
            user_name: (string) $order->user->name,
            products: $items,
            subtotal: (float) $order->subtotal,
            shipping_fee: (float) $order->shipping_fee,
            total_amount: (float) $order->total_amount,
            status: (string) $order->status,
            shipping_address: $order->shipping_address ?? $order->user->address,
            payment_status: (string) $order->payment_status,
            payment_method: (string) $order->payment_method,
            delivery_method: (string) $order->delivery_method,
            notes: (string) $order->notes,
            created_at: $order->created_at->toISOString()
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'orderNumber' => $this->order_number,
            'userName' => $this->user_name,
            'products' => array_map(fn($product) => $product->toArray(), $this->products),
            'subtotal' => $this->subtotal,
            'shippingFee' => $this->shipping_fee,
            'totalAmount' => $this->total_amount,
            'status' => $this->status,
            'shippingAddress' => $this->shipping_address,
            'paymentStatus' => $this->payment_status,
            'paymentMethod' => $this->payment_method,
            'deliveryMethod' => $this->delivery_method,
            'notes' => $this->notes,
            'createdAt' => $this->created_at,
        ];
    }

    public static function formatPaginatedOrders(LengthAwarePaginator $paginatedOrders): array
    {
        $items = collect($paginatedOrders->items())->map(function ($order) {
            $shop = $order->shop;
            $products = $order->orderItems->map(function ($item) {
                return [
                    'id' => (int) $item->product->id,
                    'order_item_id' => (int) $item->id,
                    'name' => (string) $item->product->name,
                    'price' => (float) $item->product->price,
                    'image' => $item->product->image,
                    'quantity' => (int) $item->quantity,
                    'subtotal' => (float) ($item->product->price * $item->quantity),
                ];
            });

            return [
                'id' => (int) $order->id,
                'orderNumber' => (string) $order->order_number,
                'shop' => [
                    'id' => (int) $shop->id,
                    'name' => (string) $shop->name,
                ],
                'products' => $products->values()->all(),
                'status' => $order->status,
                'statusLabel' => str_replace('_', ' ', $order->status),
                'subtotal' => (float) $order->subtotal,
                'shippingFee' => (float) $order->shipping_fee,
                'totalAmount' => (float) $order->total_amount,
                'shippingAddress' => $order->shipping_address,
                'paymentStatus' => $order->payment_status,
                'paymentMethod' => $order->payment_method,
                'deliveryMethod' => $order->delivery_method,
                'notes' => $order->notes,
                'createdAt' => $order->created_at->toISOString(),
            ];
        });

        return [
            'data' => $items->all(),
            'meta' => [
                'current_page' => $paginatedOrders->currentPage(),
                'last_page' => $paginatedOrders->lastPage(),
                'per_page' => $paginatedOrders->perPage(),
                'total' => $paginatedOrders->total(),
            ],
        ];
    }
}
