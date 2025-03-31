<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Shop;
use App\Models\Product;

class SellerAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $personalSellers = [
            [
                'name' => 'Maria\'s Fashion Hub',
                'owner' => 'Maria Santos',
                'email' => 'maria.santos@gmail.com',
                'contact_number' => '09171234567',
                'description' => 'Trendy and affordable fashion for everyone',
                'password' => Hash::make('password'),
                'role' => 'seller',
                'products' => [
                    ['name' => 'Summer Floral Dress', 'price' => 899, 'image' => 'https://example.com/images/dress.jpg'],
                    ['name' => 'Denim Jacket', 'price' => 1299, 'image' => 'https://example.com/images/jacket.jpg'],
                ]
            ],
            [
                'name' => 'Carlo\'s Tech Store',
                'owner' => 'Carlo Cruz',
                'email' => 'carlo.cruz@gmail.com',
                'contact_number' => '09189876543',
                'description' => 'Quality gadgets and accessories at great prices',
                'password' => Hash::make('password'),
                'role' => 'seller',
                'products' => [
                    ['name' => 'Wireless Earbuds', 'price' => 1499, 'image' => 'https://example.com/images/earbuds.jpg'],
                    ['name' => 'Power Bank 10000mAh', 'price' => 799, 'image' => 'https://example.com/images/powerbank.jpg'],
                ]
            ],
            [
                'name' => 'Sarah\'s Handmade Crafts',
                'owner' => 'Sarah Garcia',
                'email' => 'sarah.crafts@gmail.com',
                'contact_number' => '09234567890',
                'description' => 'Unique handmade crafts and personalized gifts',
                'password' => Hash::make('password'),
                'role' => 'seller',
                'products' => [
                    ['name' => 'Handmade Scented Candles', 'price' => 299, 'image' => 'https://example.com/images/candles.jpg'],
                    ['name' => 'Custom Name Bracelet', 'price' => 399, 'image' => 'https://example.com/images/bracelet.jpg'],
                ]
            ]
        ];

        foreach ($personalSellers as $sellerData) {
            $products = $sellerData['products'];
            unset($sellerData['products']);

            $seller = Shop::create($sellerData);
            foreach ($products as $productData) {
                $productData['shop_id'] = $seller->id;
                Product::create($productData);
            }
        }
    }
}
