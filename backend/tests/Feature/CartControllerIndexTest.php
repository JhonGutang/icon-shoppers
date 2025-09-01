<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Shop;
use App\Services\CartService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

describe('Cart Controller Index', function () {

    test('returns 401 when user is not authenticated', function () {
        $response = $this->getJson('/api/to-checkout');
        $response->assertStatus(401);
    });

    test('returns empty array when customer has no cart', function () {
        $customer = Customer::factory()->create();
        Sanctum::actingAs($customer, ['customer-api'], 'customer-api');

        $response = $this->getJson('/api/to-checkout');
        $response->assertStatus(200)
            ->assertJson([]);
    });

    test('returns empty array when cart exists but has no items', function () {
        $customer = Customer::factory()->create();
        Cart::factory()->create(['customer_id' => $customer->id]);
        Sanctum::actingAs($customer, ['customer-api'], 'customer-api');

        $response = $this->getJson('/api/to-checkout');
        $response->assertStatus(200)
            ->assertJson([]);
    });

    test('returns cart items grouped by shop when cart has items', function () {
        $customer = Customer::factory()->create();

        $shop1 = Shop::factory()->create([
            'name' => 'Electronics Store',
            'email' => 'electronics@example.com',
            'description' => 'Best electronics shop',
            'contact_number' => '1234567890',
            'logo_image' => 'electronics-logo.jpg'
        ]);
        $shop2 = Shop::factory()->create([
            'name' => 'Fashion Store',
            'email' => 'fashion@example.com',
            'description' => 'Trendy fashion items',
            'contact_number' => '0987654321',
            'logo_image' => 'fashion-logo.jpg'
        ]);

        $product1 = Product::factory()->create([
            'shop_id' => $shop1->id,
            'name' => 'iPhone 15',
            'price' => 999.99,
            'image' => 'iphone15.jpg'
        ]);
        $product2 = Product::factory()->create([
            'shop_id' => $shop1->id,
            'name' => 'MacBook Pro',
            'price' => 1999.99,
            'image' => 'macbook.jpg'
        ]);
        $product3 = Product::factory()->create([
            'shop_id' => $shop2->id,
            'name' => 'Nike Shoes',
            'price' => 129.99,
            'image' => 'nike-shoes.jpg'
        ]);

        $cart = Cart::factory()->create(['customer_id' => $customer->id]);
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product1->id,
            'quantity' => 2
        ]);
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product2->id,
            'quantity' => 1
        ]);
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product3->id,
            'quantity' => 3
        ]);

        Sanctum::actingAs($customer, ['customer-api'], 'customer-api');

        $response = $this->getJson('/api/to-checkout');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => [
                    'shop' => [
                        'id',
                        'name',
                        'email',
                        'logo_image',
                        'description',
                        'contact_number'
                    ],
                    'products' => [
                        '*' => [
                            'id',
                            'cart_item_id',
                            'name',
                            'price',
                            'image',
                            'quantity'
                        ]
                    ]
                ]
            ]);

        $responseData = $response->json();

        expect($responseData)->toHaveCount(2);

        $electronicsGroup = collect($responseData)->firstWhere('shop.name', 'Electronics Store');
        expect($electronicsGroup)->not->toBeNull();
        expect($electronicsGroup['products'])->toHaveCount(2);

        $fashionGroup = collect($responseData)->firstWhere('shop.name', 'Fashion Store');
        expect($fashionGroup)->not->toBeNull();
        expect($fashionGroup['products'])->toHaveCount(1);

        $iphone = collect($electronicsGroup['products'])->firstWhere('name', 'iPhone 15');
        expect($iphone['price'])->toBe(999.99);
        expect($iphone['quantity'])->toBe(2);
        expect($iphone['image'])->toBe('iphone15.jpg');
    });

    test('handles database transaction rollback on exception', function () {
        $customer = Customer::factory()->create();
        Sanctum::actingAs($customer, ['customer-api'], 'customer-api');

        $this->mock(CartService::class, function ($mock) {
            $mock->shouldReceive('getCartItems')
                ->once()
                ->andThrow(new Exception('Database error'));
        });

        $response = $this->getJson('/api/to-checkout');
        $response->assertStatus(500);
    });

    test('returns correct data structure for single shop single product', function () {
        $customer = Customer::factory()->create();
        $shop = Shop::factory()->create([
            'name' => 'Single Shop',
            'email' => 'single@example.com',
            'description' => 'Single product shop',
            'contact_number' => '1111111111',
            'logo_image' => 'single-logo.jpg'
        ]);
        $product = Product::factory()->create([
            'shop_id' => $shop->id,
            'name' => 'Single Product',
            'price' => 50.00,
            'image' => 'single-product.jpg'
        ]);

        $cart = Cart::factory()->create(['customer_id' => $customer->id]);
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 1
        ]);

        Sanctum::actingAs($customer, ['customer-api'], 'customer-api');

        $response = $this->getJson('/api/to-checkout');
        $response->assertStatus(200);

        $responseData = $response->json();
        expect($responseData)->toHaveCount(1);

        $shopGroup = $responseData[0];
        expect($shopGroup['shop']['name'])->toBe('Single Shop');
        expect($shopGroup['shop']['email'])->toBe('single@example.com');
        expect($shopGroup['shop']['logo_image'])->toBe('single-logo.jpg');
        expect($shopGroup['shop']['description'])->toBe('Single product shop');
        expect($shopGroup['shop']['contact_number'])->toBe('1111111111');

        expect($shopGroup['products'])->toHaveCount(1);
        $productData = $shopGroup['products'][0];
        expect($productData['name'])->toBe('Single Product');
        expect($productData['price'])->toBe(50.00);
        expect($productData['image'])->toBe('single-product.jpg');
        expect($productData['quantity'])->toBe(1);
    });

    test('handles products with null images', function () {
        $customer = Customer::factory()->create();
        $shop = Shop::factory()->create();

        $product = Product::factory()->create([
            'shop_id' => $shop->id,
            'name' => 'Product without image',
            'price' => 25.00,
            'image' => null
        ]);

        $cart = Cart::factory()->create(['customer_id' => $customer->id]);
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 1
        ]);

        Sanctum::actingAs($customer, ['customer-api'], 'customer-api');

        $response = $this->getJson('/api/to-checkout');
        $response->assertStatus(200);

        $responseData = $response->json();
        $productData = $responseData[0]['products'][0];
        expect($productData['image'])->toBeNull();
    });

    test('handles shops with null logo images', function () {
        $customer = Customer::factory()->create();
        $shop = Shop::factory()->create([
            'name' => 'Shop without logo',
            'logo_image' => null
        ]);
        $product = Product::factory()->create([
            'shop_id' => $shop->id,
            'name' => 'Test Product',
            'price' => 30.00
        ]);

        $cart = Cart::factory()->create(['customer_id' => $customer->id]);
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 1
        ]);

        Sanctum::actingAs($customer, ['customer-api'], 'customer-api');

        $response = $this->getJson('/api/to-checkout');
        $response->assertStatus(200);

        $responseData = $response->json();
        $shopData = $responseData[0]['shop'];
        expect($shopData['logo_image'])->toBeNull();
    });

    test('returns correct cart item id in response', function () {
        $customer = Customer::factory()->create();
        $shop = Shop::factory()->create();
        $product = Product::factory()->create(['shop_id' => $shop->id]);

        $cart = Cart::factory()->create(['customer_id' => $customer->id]);
        $cartItem = CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 1
        ]);

        Sanctum::actingAs($customer, ['customer-api'], 'customer-api');

        $response = $this->getJson('/api/to-checkout');
        $response->assertStatus(200);

        $responseData = $response->json();
        $productData = $responseData[0]['products'][0];
        expect($productData['cart_item_id'])->toBe($cartItem->id);
    });

    test('handles multiple quantities correctly', function () {
        $customer = Customer::factory()->create();
        $shop = Shop::factory()->create();
        $product = Product::factory()->create(['shop_id' => $shop->id]);

        $cart = Cart::factory()->create(['customer_id' => $customer->id]);
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 5
        ]);

        Sanctum::actingAs($customer, ['customer-api'], 'customer-api');

        $response = $this->getJson('/api/to-checkout');
        $response->assertStatus(200);

        $responseData = $response->json();
        $productData = $responseData[0]['products'][0];
        expect($productData['quantity'])->toBe(5);
    });

    test('returns 403 when using wrong guard', function () {
        $customer = Customer::factory()->create();
        Sanctum::actingAs($customer, ['customer-api'], 'customer-api');
        $response = $this->getJson('/api/profile');
        $response->assertStatus(403);
    });

    test('handles decimal prices correctly', function () {
        $customer = Customer::factory()->create();
        $shop = Shop::factory()->create();
        $product = Product::factory()->create([
            'shop_id' => $shop->id,
            'name' => 'Expensive Product',
            'price' => 1234.56
        ]);

        $cart = Cart::factory()->create(['customer_id' => $customer->id]);
        CartItem::factory()->create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 1
        ]);

        Sanctum::actingAs($customer, ['customer-api'], 'customer-api');

        $response = $this->getJson('/api/to-checkout');
        $response->assertStatus(200);

        $responseData = $response->json();
        $productData = $responseData[0]['products'][0];
        expect($productData['price'])->toBe(1234.56);
    });
});
