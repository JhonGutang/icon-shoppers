<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;
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
                    'name' => 'Local Flavor Kitchen',
                    'description' => 'Authentic homemade Filipino delicacies and gourmet treats.',
                ],
                'category' => 'Food',
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
                    'name' => 'StyleVault Co.',
                    'description' => 'Premium gadgets and accessories for the modern professional.',
                ],
                'category' => 'Electronics',
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
                    'name' => 'Petals & Stems',
                    'description' => 'Unique handcrafted items and personalized gifts.',
                ],
                'category' => 'Art',
            ],
        ];

        // Food product images for Local Flavor Kitchen
        $foodImages = [
            'balut.jpg',
            'blue-lemonade.jpg',
            'buko-pandan.jpg',
            'chicharon.jpg',
            'corndog.jpg',
            'fishball.jpg',
            'isaw.jpg',
            'kwek-kwek.jpg',
            'mango-juice.jpg',
            'tempura.jpg',
        ];

        // Accessories product images for StyleVault Co.
        $accessoriesImages = [
            'cherry-earrings.jpg',
            'crochet-jellyfish-keychains.jpg',
            'crochet-pikachu-keychain.jpg',
            'ghibli-couple-bracelet.jpg',
            'hair-claw-clips.jpg',
            'hair-clips.jpg',
            'hoop-earrings.jpg',
            'song-inspired-bracelets.jpg',
            'sun-and-moon-couple-ring.jpg',
            'tulip-flower-ring.jpg',
        ];

        // Bouquet product images for Petals & Stems
        $bouquetImages = [
            'crochet-bouquet.jpg',
            'gerberas-bouquet.jpg',
            'hibiscus-bouquet.jpg',
            'hyacinth-bouquet.jpg',
            'lilies-bouquet.jpg',
            'peonies-bouquet.jpg',
            'pink-fuzzy-wire-bouquet.jpg',
            'rose-bouquet.jpg',
            'sunflower-bouquet.jpg',
            'tulips-bouquet.jpg',
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
                // Use real images based on category
                if ($m['category'] === 'Food') {
                    $imageName = $foodImages[$i - 1];
                    $imagePath = $shop->slug.'/products/'.$imageName;
                    $productName = ucwords(str_replace('-', ' ', pathinfo($imageName, PATHINFO_FILENAME)));
                } elseif ($m['category'] === 'Electronics') {
                    $imageName = $accessoriesImages[$i - 1];
                    $imagePath = $shop->slug.'/products/'.$imageName;
                    $productName = ucwords(str_replace('-', ' ', pathinfo($imageName, PATHINFO_FILENAME)));
                } else {
                    $imageName = $bouquetImages[$i - 1];
                    $imagePath = $shop->slug.'/products/'.$imageName;
                    $productName = ucwords(str_replace('-', ' ', pathinfo($imageName, PATHINFO_FILENAME)));
                }

                $product = Product::create([
                    'shop_id' => $shop->id,
                    'name' => $productName,
                    'price' => rand(100, 5000),
                    'quantity' => rand(10, 100),
                    'description' => 'Detailed description for '.$productName,
                    'image' => $imagePath,
                    'is_visible' => true,
                    'is_featured' => $i <= 3,
                ]);

                // Simple variants
                if ($i % 2 == 0) {
                    \App\Models\ProductVariant::create([
                        'product_id' => $product->id,
                        'sku' => 'VAR-'.$product->id.'-S',
                        'price' => $product->price,
                        'stock' => 5,
                        'attributes' => ['Size' => 'Small'],
                    ]);
                    \App\Models\ProductVariant::create([
                        'product_id' => $product->id,
                        'sku' => 'VAR-'.$product->id.'-L',
                        'price' => $product->price + 50,
                        'stock' => 10,
                        'attributes' => ['Size' => 'Large'],
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
