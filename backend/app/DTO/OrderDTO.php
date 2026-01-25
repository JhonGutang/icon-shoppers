<?php

namespace App\DTO;

use Illuminate\Support\Collection;

class OrderDTO
{
	public function __construct(
		public readonly int $id,
		public readonly string $user_name,
		public readonly array $products,
		public readonly float $total_amount,
		public readonly string $status,
		public readonly ?string $shipping_address
	) {}

	public static function fromOrder($order): self
	{
		$items = $order->orderItems->map(fn($item) => OrderItemDTO::fromOrderItem($item))->toArray();

		return new self(
			id: (int) $order->id,
			user_name: (string) $order->user->name,
			products: $items,
			total_amount: (float) $order->total_amount,
			status: (string) $order->status,
			shipping_address: $order->shipping_address ?? $order->user->address
		);
	}

	public function toArray(): array
	{
		return [
			'id' => $this->id,
			'userName' => $this->user_name,
			'products' => array_map(fn($product) => $product->toArray(), $this->products),
			'totalAmount' => $this->total_amount,
			'status' => $this->status,
			'shippingAddress' => $this->shipping_address,
		];
	}

	public static function formatCustomerOrders(Collection $orders): array
	{
		if ($orders->isEmpty()) {
			return [];
		}

		return $orders->map(function ($order) {
            $shop = $order->shop;
            $products = $order->orderItems->map(function ($item) {
                return [
                    'id' => (int) $item->product->id,
                    'order_item_id' => (int) $item->id,
                    'name' => (string) $item->product->name,
                    'price' => (float) $item->product->price,
                    'image' => $item->product->image,
                    'quantity' => (int) $item->quantity,
                ];
            });

            return [
                'order_id' => (int) $order->id,
                'shop' => [
                    'id' => (int) $shop->id,
                    'name' => (string) $shop->name,
                    'description' => $shop->description,
                ],
                'products' => $products->values()->all(),
                'status' => str_replace('_', ' ', $order->status),
                'total_amount' => number_format((float) $order->total_amount, 2, '.', ''),
                'payment_status' => $order->payment_status,
                'payment_method' => $order->payment_method,
            ];
		})->all();
	}
}


