<?php

namespace App\DTO;

class ShopDTO
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $email,
        public readonly ?string $logo_image,
        public readonly ?string $description,
        public readonly ?string $contact_number
    ) {}

    public static function fromShop($shop): self
    {
        return new self(
            id: $shop->id,
            name: $shop->name,
            email: $shop->email,
            logo_image: $shop->logo_image,
            description: $shop->description,
            contact_number: $shop->contact_number
        );
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'logo_image' => $this->logo_image,
            'description' => $this->description,
            'contact_number' => $this->contact_number,
        ];
    }
}
