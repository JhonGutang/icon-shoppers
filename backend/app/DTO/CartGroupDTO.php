<?php

namespace App\DTO;

class CartGroupDTO
{
    public function __construct(
        public readonly ShopDTO $shop,
        public readonly array $products
    ) {}

    public static function fromCartItems($items): self
    {
        $shop = ShopDTO::fromShop($items->first()->product->shop);
        $products = $items->map(fn($item) => CartItemDTO::fromCartItem($item))->toArray();

        return new self(
            shop: $shop,
            products: $products
        );
    }

    public function toArray(): array
    {
        return [
            'shop' => $this->shop->toArray(),
            'products' => array_map(fn($product) => $product->toArray(), $this->products),
        ];
    }
}
