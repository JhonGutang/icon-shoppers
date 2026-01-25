<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Shop;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;

class DefaultDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Demo Customer
        User::create([
            'name' => 'John Doe',
            'email' => 'john1.doe@example.com',
            'contact_number' => '09123456789',
            'address' => 'Manila, Philippines',
            'role' => User::ROLE_CUSTOMER,
            'password' => Hash::make('password'),
        ]);

        // 2. Create Demo Merchants and Shops
        $merchants = [
            [
                'user' => [
                    'name' => 'Maria Santos',
                    'email' => 'maria.santos@gmail.com',
                    'contact_number' => '09171234567',
                    'address' => 'Quezon City',
                    'role' => User::ROLE_MERCHANT,
                    'password' => Hash::make('password'),
                ],
                'shop' => [
                    'name' => 'Maria\'s Gourmet Delights',
                    'description' => 'Authentic homemade Filipino delicacies and gourmet treats.',
                ],
                'category' => 'Food'
            ],
            [
                'user' => [
                    'name' => 'Carlo Cruz',
                    'email' => 'carlo.cruz@gmail.com',
                    'contact_number' => '09187654321',
                    'address' => 'Makati City',
                    'role' => User::ROLE_MERCHANT,
                    'password' => Hash::make('password'),
                ],
                'shop' => [
                    'name' => 'Cruz Tech Solutions',
                    'description' => 'Premium gadgets and accessories for the modern professional.',
                ],
                'category' => 'Electronics'
            ],
            [
                'user' => [
                    'name' => 'Sarah Crafts',
                    'email' => 'sarah.crafts@gmail.com',
                    'contact_number' => '09191112222',
                    'address' => 'Baguio City',
                    'role' => User::ROLE_MERCHANT,
                    'password' => Hash::make('password'),
                ],
                'shop' => [
                    'name' => 'Sarah\'s Artisan Crafts',
                    'description' => 'Unique handcrafted items and personalized gifts.',
                ],
                'category' => 'Art'
            ],
        ];

        foreach ($merchants as $m) {
            $user = User::create($m['user']);
            $shop = Shop::create([
                'name' => $m['shop']['name'],
                'owner_id' => $user->id,
                'description' => $m['shop']['description'],
            ]);

            // Create 20 products for each shop
            for ($i = 1; $i <= 20; $i++) {
                Product::create([
                    'shop_id' => $shop->id,
                    'name' => $m['category'] . " Item " . $i,
                    'price' => rand(100, 5000),
                    'quantity' => rand(10, 100),
                    'description' => "Detailed description for " . $m['category'] . " Item " . $i,
                    'image' => "https://picsum.photos/seed/" . md5($shop->name . $i) . "/400/300",
                    'is_visible' => true,
                    'is_featured' => $i <= 5, // First 5 are featured
                ]);
            }
        }

        $this->command->info('Demo accounts and 60 products seeded successfully!');
    }
}
