<?php

namespace App\DTO;

use Illuminate\Support\Collection;

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
			'not_received' => 8,
			'completed' => 9,
		];

		$normalizedStatus = strtolower(trim($status));
		
		return $statusMap[$normalizedStatus] ?? null;
	}

	/**
	 * Build the grouped-by-shop formatted payload from a collection of orders.
	 * Mirrors the response shape used by customer orders listing.
	 */
	public static function formatCustomerOrders(Collection $orders): array
	{
		if ($orders->isEmpty()) {
			return [];
		}

		$grouped = $orders->map(function ($order) {
			$shopOrders = $order->orderItems->groupBy(function ($item) {
				return $item->product->shop->id;
			});

			return $shopOrders->map(function ($items) use ($order) {
				$shop = $items->first()->product->shop;

				$products = $items->map(function ($item) {
					return [
						'id' => (int) $item->product->id,
						'order_item_id' => (int) $item->id,
						'name' => (string) $item->product->name,
						'price' => (float) $item->product->price,
						'image' => $item->product->image,
						'quantity' => (int) $item->quantity,
					];
				});

				// Remove underscores from status value if present
				$statusRaw = (string) ($order->order_status->status ?? $order->orderStatus->status ?? '');
				$status = str_replace('_', ' ', $statusRaw);

				return [
					'order_id' => (int) $order->id,
					'shop' => [
						'id' => (int) $shop->id,
						'name' => (string) $shop->name,
						'email' => (string) $shop->email,
						'description' => $shop->description,
						'contact_number' => $shop->contact_number,
					],
					'products' => $products->values()->all(),
					'status' => $status,
					'total_amount' => number_format((float) $order->total_amount, 2, '.', ''),
				];
			})->values();
		})->flatten(1);

		return $grouped->all();
	}
}


