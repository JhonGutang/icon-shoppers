<?php

use App\Models\Conversation;
use App\Models\Order;
use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use App\Notifications\NewMessageNotification;
use App\Notifications\OrderPlacedNotification;
use App\Notifications\OrderStatusChangedNotification;
use Illuminate\Support\Facades\Notification;

test('seller receives notification when buyer checkouts', function () {
    $buyer = $this->actingAsCustomer();
    $seller = User::factory()->create(['role' => User::ROLE_MERCHANT]);
    $shop = Shop::factory()->create(['owner_id' => $seller->id]);
    $product = Product::factory()->create(['shop_id' => $shop->id, 'price' => 100]);

    Notification::fake();

    $data = [
        'products' => [
            ['id' => $product->id, 'quantity' => 1],
        ],
        'shipping_address' => 'Test Address',
        'payment_method' => 'COD',
    ];

    $this->postJson('/api/checkout', $data);

    Notification::assertSentTo($seller, OrderPlacedNotification::class);
});

test('buyer receives notification when order status is updated', function () {
    $seller = $this->actingAsMerchant();
    $buyer = User::factory()->create(['role' => User::ROLE_CUSTOMER]);
    $order = Order::factory()->create(['shop_id' => $seller->shop->id, 'user_id' => $buyer->id, 'status' => 'ordered']);

    Notification::fake();

    $this->putJson("/api/orders/{$order->id}/status", [
        'status' => 'approved',
    ]);

    Notification::assertSentTo($buyer, OrderStatusChangedNotification::class);
});

test('recipient receives notification on new message', function () {
    $buyer = $this->actingAsCustomer();
    $seller = User::factory()->create(['role' => User::ROLE_MERCHANT]);
    $shop = Shop::factory()->create(['owner_id' => $seller->id]);

    $conversation = Conversation::create([
        'buyer_id' => $buyer->id,
        'shop_id' => $shop->id,
    ]);

    Notification::fake();

    $this->postJson("/api/conversations/{$conversation->id}/messages", [
        'body' => 'Hello Seller',
    ]);

    Notification::assertSentTo($seller, NewMessageNotification::class);
});

test('user can fetch notifications and mark as read', function () {
    $user = $this->actingAsCustomer();

    // Create a dummy notification
    $order = Order::factory()->create(['user_id' => $user->id]);
    $user->notify(new OrderStatusChangedNotification($order));

    $response = $this->getJson('/api/notifications');
    $response->assertStatus(200)
        ->assertJsonCount(1, 'data');

    $notificationId = $response->json('data.0.id');

    $this->postJson("/api/notifications/{$notificationId}/read")
        ->assertStatus(200);

    $this->getJson('/api/notifications/unread-count')
        ->assertJson(['count' => 0]);
});
