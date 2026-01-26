<?php

namespace App\DTO;

class OrderItemDTO
{
    public function __construct(
        public readonly int $product_id,
        public readonly string $name,
        public readonly int $quantity,
        public readonly float $price,
        public readonly float $total,
        public readonly ?string $image
    ) {}

    /**
     * Build an array for saving to database from checkout request item and loaded Product model.
     */
    public static function fromCheckoutItem(int $orderId, array $productItem, $product): array
    {
        $quantity = (int) ($productItem['quantity'] ?? 0);
        $price = (float) $product->price;
        $total = $price * $quantity;

        return [
            'order_id' => $orderId,
            'product_id' => (int) $product->id,
            'quantity' => $quantity,
            'price' => $price,
            'total' => $total,
        ];
    }

    public static function fromOrderItem($orderItem): self
    {
        return new self(
            product_id: (int) $orderItem->product->id,
            name: (string) $orderItem->product->name,
            quantity: (int) $orderItem->quantity,
            price: (float) $orderItem->price,
            total: (float) $orderItem->total,
            image: $orderItem->product->image
        );
    }

    public function toArray(): array
    {
        return [
            'productId' => $this->product_id,
            'name' => $this->name,
            'quantity' => $this->quantity,
            'price' => $this->price,
            'total' => $this->total,
            'image' => $this->image,
        ];
    }
}
