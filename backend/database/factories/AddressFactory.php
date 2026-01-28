<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AddressFactory extends Factory
{
    protected $model = Address::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => $this->faker->name,
            'phone' => $this->faker->phoneNumber,
            'street' => $this->faker->streetAddress,
            'barangay' => $this->faker->citySuffix,
            'city' => $this->faker->city,
            'postal_code' => $this->faker->postcode,
            'is_default' => false,
        ];
    }
}
