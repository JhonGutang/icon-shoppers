<?php

use App\Models\User;
use App\Models\Shop;
use Laravel\Sanctum\Sanctum;

test('anyone can view all shops', function () {
    Shop::factory()->count(3)->create();

    $response = $this->getJson('/api/shops');

    $response->assertStatus(200);
});

test('anyone can view a specific shop by slug', function () {
    $shop = Shop::factory()->create(['name' => 'Maria\'s Gourmet']);
    $slug = $shop->slug;

    $response = $this->getJson("/api/shop/{$slug}");

    $response->assertStatus(200)
        ->assertJsonFragment(['name' => 'Maria\'s Gourmet', 'slug' => $slug]);
});

test('authenticated user can create a shop', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $data = [
        'name' => 'Unique Shop Name',
        'description' => 'A very unique shop',
        'category' => 'Food'
    ];

    $response = $this->postJson('/api/shops', $data);

    $response->assertStatus(201)
        ->assertJsonFragment(['name' => 'Unique Shop Name']);
    
    $this->assertDatabaseHas('shops', [
        'name' => 'Unique Shop Name',
        'owner_id' => $user->id
    ]);
});

test('merchant can view shop analytics', function () {
    $merchant = $this->actingAsMerchant();

    $response = $this->getJson('/api/shop/analytics');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'total_revenue',
            'total_orders',
            'total_products',
            'average_rating'
        ]);
});

test('non-merchant cannot view shop analytics', function () {
    $this->actingAsCustomer();

    $response = $this->getJson('/api/shop/analytics');

    $response->assertStatus(404); // Controller returns 404 if !hasShop()
});
