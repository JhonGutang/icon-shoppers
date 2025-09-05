<?php

namespace App\DTO;

class OrderDTO
{
	public function __construct(
		public readonly int $id,
		public readonly string $customer_name,
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
			customer_name: (string) $order->customer->name,
			products: $items,
			total_amount: (float) $order->total_amount,
			status: (string) $order->orderStatus->status,
			shipping_address: $order->shipping_address
		);
	}

	public function toArray(): array
	{
		return [
			'id' => $this->id,
			'customerName' => $this->customer_name,
			'products' => array_map(fn($product) => $product->toArray(), $this->products),
			'totalAmount' => $this->total_amount,
			'status' => $this->status,
			'shippingAddress' => $this->shipping_address,
		];
	}

	/**
	 * Convert order status string to its corresponding ID
	 * Case insensitive conversion based on OrderStatusSeeder
	 */
	public static function getStatusId(string $status): ?int
	{
		$statusMap = [
			'all' => 0,
			'ordered' => 1,
			'approved' => 2,
			'rejected' => 3,
			'to_be_delivered' => 4,
			'delivering' => 5,
			'delivered' => 6,
			'received' => 7,
			'completed' => 8
		];

		$normalizedStatus = strtolower(trim($status));
		
		return $statusMap[$normalizedStatus] ?? null;
	}
}


