<?php

namespace App\DTO;

class ShopDTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly ?string $logo_image,
        public readonly ?string $description
    ) {}

    public static function fromShop($shop): self
    {
        return new self(
            id: $shop->id,
            name: $shop->name,
            logo_image: $shop->logo_image,
            description: $shop->description
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'logo_image' => $this->logo_image,
            'description' => $this->description,
        ];
    }
}
