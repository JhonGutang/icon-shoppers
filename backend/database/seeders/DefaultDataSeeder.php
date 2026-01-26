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
                'category' => $m['category'],
                'shipping_fee' => 50.00,
                'status' => Shop::STATUS_ACTIVE,
            ]);

            for ($i = 1; $i <= 10; $i++) {
                $product = Product::create([
                    'shop_id' => $shop->id,
                    'name' => $m['category'] . " Item " . $i,
                    'price' => rand(100, 5000),
                    'quantity' => rand(10, 100),
                    'description' => "Detailed description for " . $m['category'] . " Item " . $i,
                    'image' => "https://picsum.photos/seed/" . md5($shop->name . $i) . "/400/300",
                    'is_visible' => true,
                    'is_featured' => $i <= 3,
                ]);

                // Simple variants
                if ($i % 2 == 0) {
                    \App\Models\ProductVariant::create([
                        'product_id' => $product->id,
                        'sku' => 'VAR-' . $product->id . '-S',
                        'price' => $product->price,
                        'stock' => 5,
                        'attributes' => ['Size' => 'Small']
                    ]);
                    \App\Models\ProductVariant::create([
                        'product_id' => $product->id,
                        'sku' => 'VAR-' . $product->id . '-L',
                        'price' => $product->price + 50,
                        'stock' => 10,
                        'attributes' => ['Size' => 'Large']
                    ]);
                }
            }
        }

        // Create sample orders for John Doe
        $customer = User::where('email', 'john1.doe@example.com')->first();
        $shops = Shop::all();
        $statuses = [\App\Models\Order::STATUS_PENDING, \App\Models\Order::STATUS_PROCESSING, \App\Models\Order::STATUS_SHIPPED, \App\Models\Order::STATUS_DELIVERED];

        foreach ($shops as $index => $shop) {
            $order = \App\Models\Order::create([
                'user_id' => $customer->id,
                'shop_id' => $shop->id,
                'status' => $statuses[$index % count($statuses)],
                'total_amount' => 0,
                'payment_method' => 'COD',
                'payment_status' => \App\Models\Order::PAYMENT_STATUS_PENDING,
                'shipping_address' => 'Sample Address for John Doe',
                'notes' => 'Please deliver by 5 PM.',
            ]);

            $products = $shop->products()->limit(2)->get();
            $total = 0;
            foreach ($products as $product) {
                $item = \App\Models\OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => rand(1, 3),
                    'price' => $product->price,
                    'total' => $product->price * rand(1, 3),
                ]);
                $total += $item->total;
            }
            $order->update(['total_amount' => $total + $shop->shipping_fee]);
        }

        $this->command->info('New MVP demo data seeded successfully!');
    }
}
