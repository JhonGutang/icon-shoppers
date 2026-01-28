<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'shop_id' => Shop::factory(),
            'status' => 'ordered',
            'total_amount' => fake()->randomFloat(2, 50, 5000),
            'payment_method' => 'COD',
            'payment_status' => Order::PAYMENT_STATUS_PENDING,
            'shipping_address' => fake()->address(),
            'notes' => fake()->sentence(),
        ];
    }
}
