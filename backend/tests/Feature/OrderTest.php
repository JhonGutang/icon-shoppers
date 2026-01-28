<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\Shop;

test('customer can checkout their cart', function () {
    $user = $this->actingAsCustomer();
    $shop = Shop::factory()->create();
    $product = Product::factory()->create(['shop_id' => $shop->id, 'price' => 100]);

    $data = [
        'products' => [
            ['id' => $product->id, 'quantity' => 2],
        ],
        'shipping_address' => '123 Test St, Balamban',
        'payment_method' => 'COD',
    ];

    $response = $this->postJson('/api/checkout', $data);

    $response->assertStatus(200)
        ->assertJsonFragment(['message' => 'Order(s) placed successfully']);

    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'shop_id' => $shop->id,
        'shipping_address' => '123 Test St, Balamban',
    ]);
});

test('customer can view their orders', function () {
    $user = $this->actingAsCustomer();
    Order::factory()->count(2)->create(['user_id' => $user->id]);

    $response = $this->getJson('/api/customer/orders');

    $response->assertStatus(200);
});

test('merchant can view their received orders', function () {
    $merchant = $this->actingAsMerchant();
    Order::factory()->count(2)->create(['shop_id' => $merchant->shop->id]);

    $response = $this->getJson('/api/seller/orders');

    $response->assertStatus(200);
});

test('merchant can update order status', function () {
    $merchant = $this->actingAsMerchant();
    $order = Order::factory()->create(['shop_id' => $merchant->shop->id, 'status' => 'ordered']);

    $response = $this->putJson("/api/orders/{$order->id}/status", [
        'status' => 'approved',
    ]);

    $response->assertStatus(200)
        ->assertJsonFragment(['message' => 'Order status updated to approved']);

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'approved',
    ]);
});

test('merchant can update order status using legacy uppercase string', function () {
    $merchant = $this->actingAsMerchant();
    $order = Order::factory()->create(['shop_id' => $merchant->shop->id, 'status' => 'ordered']);

    $response = $this->putJson("/api/orders/{$order->id}/status", [
        'status' => 'SHIPPED',
    ]);

    $response->assertStatus(200);

    // SHIPPED should normalize to delivering
    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'delivering',
    ]);
});

test('customer can cancel their pending order', function () {
    $user = $this->actingAsCustomer();
    $order = Order::factory()->create(['user_id' => $user->id, 'status' => 'ordered']);

    $response = $this->postJson("/api/orders/{$order->id}/cancel", [
        'reason' => 'Changed my mind',
    ]);

    $response->assertStatus(200)
        ->assertJsonFragment(['message' => 'Order cancelled successfully']);

    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'cancelled', // Assuming SERVICE handles the status change to cancelled
    ]);
});
