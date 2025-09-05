<?php

namespace App\DTO;

class OrderItemDTO
{
	public function __construct(
		public readonly int $product_id,
		public readonly string $name,
		public readonly int $quantity,
		public readonly float $unit_price,
		public readonly float $total_price
	) {}

	/**
	 * Build a DTO from raw checkout request item and loaded Product model.
	 */
	public static function fromCheckoutItem(int $orderId, array $productItem, $product): array
	{
		$quantity = (int) ($productItem['quantity'] ?? 0);
		$unitPrice = (float) $product->price;
		$total = $unitPrice * $quantity;

		return [
			'order_id' => $orderId,
			'product_id' => (int) $productItem['id'],
			'quantity' => $quantity,
			'price' => $unitPrice * $quantity,
			'total' => $total,
		];
	}

	public static function fromOrderItem($orderItem): self
	{
		$unitPrice = (float) $orderItem->product->price;
		$quantity = (int) $orderItem->quantity;

		return new self(
			product_id: (int) $orderItem->product->id,
			name: (string) $orderItem->product->name,
			quantity: $quantity,
			unit_price: $unitPrice,
			total_price: $quantity * $unitPrice
		);
	}

	public function toArray(): array
	{
		return [
			'product_id' => $this->product_id,
			'name' => $this->name,
			'quantity' => $this->quantity,
			'totalPrice' => $this->total_price,
		];
	}
}


