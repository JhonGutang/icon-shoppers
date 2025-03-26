<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\Shop;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;

class DefaultDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create default customer
        $customer = Customer::create([
            'name' => 'John',
            'middle_name' => 'Doe',
            'contact_number' => '09123456789',
            'address' => '123 Main Street, Manila',
            'email' => 'john.doe@example.com',
            'password' => Hash::make('password'),
        ]);


        $shops = [
            [
                'name' => 'SM Department Store',
                'owner' => 'SM Prime Holdings',
                'email' => 'contact@smstore.com',
                'contact_number' => '0288888888',
                'description' => 'Official SM Store - Clothing, Appliances, and Home Essentials',
                'products' => [
                    ['name' => 'Samsung 55" UHD Smart TV', 'price' => 39999, 'image' => 'https://example.com/images/samsung-tv.jpg'],
                    ['name' => 'Converse Chuck Taylor All Star', 'price' => 3500, 'image' => 'https://example.com/images/converse-shoes.jpg'],
                    ['name' => 'American Tourister Luggage', 'price' => 6999, 'image' => 'https://example.com/images/luggage.jpg'],
                    ['name' => 'Panasonic Microwave Oven', 'price' => 4999, 'image' => 'https://example.com/images/microwave.jpg'],
                    ['name' => 'Sony Bluetooth Headphones', 'price' => 2999, 'image' => 'https://example.com/images/sony-headphones.jpg'],
                ],
            ],
            [
                'name' => 'National Bookstore',
                'owner' => 'Socorro Ramos',
                'email' => 'support@nationalbookstore.com',
                'contact_number' => '0288965888',
                'description' => 'Official National Bookstore - Books, School & Office Supplies',
                'products' => [
                    ['name' => 'Pilot G-Tech Pen Black', 'price' => 55, 'image' => 'https://example.com/images/pen.jpg'],
                    ['name' => 'Yellow Pad Paper 80 leaves', 'price' => 35, 'image' => 'https://example.com/images/yellowpad.jpg'],
                    ['name' => 'The Subtle Art of Not Giving a F*ck by Mark Manson', 'price' => 799, 'image' => 'https://example.com/images/mark-manson-book.jpg'],
                    ['name' => 'Staedtler Colored Pencils Set of 24', 'price' => 699, 'image' => 'https://example.com/images/colored-pencils.jpg'],
                    ['name' => 'Stabilo Highlighter Set', 'price' => 299, 'image' => 'https://example.com/images/stabilo.jpg'],
                ],
            ],
            [
                'name' => 'Fully Booked',
                'owner' => 'Jaime Daez',
                'email' => 'hello@fullybooked.com',
                'contact_number' => '0288899888',
                'description' => 'Fully Booked - Home of the best books and graphic novels',
                'products' => [
                    ['name' => 'Atomic Habits by James Clear', 'price' => 999, 'image' => 'https://example.com/images/atomic-habits.jpg'],
                    ['name' => 'Dune by Frank Herbert', 'price' => 1200, 'image' => 'https://example.com/images/dune.jpg'],
                    ['name' => 'Moleskine Classic Notebook', 'price' => 1150, 'image' => 'https://example.com/images/moleskine.jpg'],
                    ['name' => 'Faber-Castell Calligraphy Pen Set', 'price' => 899, 'image' => 'https://example.com/images/faber-castell.jpg'],
                    ['name' => 'Kindle Paperwhite', 'price' => 8999, 'image' => 'https://example.com/images/kindle.jpg'],
                ],
            ],
        ];


        foreach ($shops as $shopData) {
            $shop = Shop::create([
                'name' => $shopData['name'],
                'owner' => $shopData['owner'],
                'email' => $shopData['email'],
                'contact_number' => $shopData['contact_number'],
                'description' => $shopData['description'],
                'password' => Hash::make('password'),
            ]);

            foreach ($shopData['products'] as $product) {
                Product::create([
                    'shop_id' => $shop->id,
                    'name' => $product['name'],
                    'price' => $product['price'],
                    'quantity' => rand(10, 50),
                    'image' => $product['image'],
                    'is_visible' => true,
                    'is_featured' => rand(0, 1),
                ]);
            }
        }

        $this->command->info('Default customer and actual shops with real products seeded!');
    }
}
