<?php

namespace App\DTO;

class CartItemDTO
{
    public function __construct(
        public readonly int $id,
        public readonly int $cart_item_id,
        public readonly string $name,
        public readonly float $price,
        public readonly ?string $image,
        public readonly int $quantity
    ) {}

    public static function fromCartItem($cartItem): self
    {
        return new self(
            id: $cartItem->product->id,
            cart_item_id: $cartItem->id,
            name: $cartItem->product->name,
            price: $cartItem->product->price,
            image: $cartItem->product->image,
            quantity: $cartItem->quantity
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'cart_item_id' => $this->cart_item_id,
            'name' => $this->name,
            'price' => $this->price,
            'image' => $this->image,
            'quantity' => $this->quantity,
        ];
    }
}
