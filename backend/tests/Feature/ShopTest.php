<?php

use App\Models\Shop;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
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

test('authenticated user can create a shop with password confirmation', function () {
    $user = User::factory()->create(['password' => Hash::make('secret123')]);
    Sanctum::actingAs($user);

    $data = [
        'name' => 'Unique Shop Name',
        'description' => 'A very unique shop',
        'category' => 'Food',
        'shipping_fee' => 50.00,
        'status' => 'active',
        'password' => 'secret123',
    ];

    $response = $this->postJson('/api/shops', $data);

    $response->assertStatus(201)
        ->assertJsonFragment(['name' => 'Unique Shop Name']);

    $this->assertDatabaseHas('shops', [
        'name' => 'Unique Shop Name',
        'owner_id' => $user->id,
        'status' => 'active',
    ]);
});

test('shop creation fails with incorrect password', function () {
    $user = User::factory()->create(['password' => Hash::make('secret123')]);
    Sanctum::actingAs($user);

    $data = [
        'name' => 'Another Shop',
        'description' => 'Description',
        'category' => 'Food',
        'shipping_fee' => 50.00,
        'status' => 'active',
        'password' => 'wrong-password',
    ];

    $response = $this->postJson('/api/shops', $data);

    $response->assertStatus(422)
        ->assertJsonFragment(['message' => 'Incorrect password confirmation.']);
});

test('authenticated user can delete their shop', function () {
    $user = User::factory()->create(['password' => Hash::make('secret123'), 'role' => User::ROLE_MERCHANT]);
    $shop = Shop::factory()->create(['owner_id' => $user->id, 'name' => 'My Shop to Delete']);
    Sanctum::actingAs($user);

    $data = [
        'password' => 'secret123',
        'shop_name' => 'My Shop to Delete',
    ];

    $response = $this->postJson('/api/shops/delete', $data);

    $response->assertStatus(200)
        ->assertJsonFragment(['message' => 'Shop deleted successfully']);

    $this->assertDatabaseMissing('shops', ['id' => $shop->id]);
    $this->assertEquals(User::ROLE_CUSTOMER, $user->fresh()->role);
});

test('shop deletion fails with incorrect password', function () {
    $user = User::factory()->create(['password' => Hash::make('secret123'), 'role' => User::ROLE_MERCHANT]);
    $shop = Shop::factory()->create(['owner_id' => $user->id, 'name' => 'My Shop']);
    Sanctum::actingAs($user);

    $data = [
        'password' => 'wrong-password',
        'shop_name' => 'My Shop',
    ];

    $response = $this->postJson('/api/shops/delete', $data);

    $response->assertStatus(422)
        ->assertJsonFragment(['message' => 'Incorrect password confirmation.']);
});

test('shop deletion fails with incorrect shop name confirmation', function () {
    $user = User::factory()->create(['password' => Hash::make('secret123'), 'role' => User::ROLE_MERCHANT]);
    $shop = Shop::factory()->create(['owner_id' => $user->id, 'name' => 'Real Shop Name']);
    Sanctum::actingAs($user);

    $data = [
        'password' => 'secret123',
        'shop_name' => 'Wrong Shop Name',
    ];

    $response = $this->postJson('/api/shops/delete', $data);

    $response->assertStatus(422)
        ->assertJsonFragment(['message' => 'Shop name confirmation does not match.']);
});

test('merchant can view shop analytics', function () {
    $merchant = $this->actingAsMerchant();

    $response = $this->getJson('/api/shop/analytics');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'total_revenue',
            'total_orders',
            'total_products',
            'average_rating',
        ]);
});

test('non-merchant cannot view shop analytics', function () {
    $this->actingAsCustomer();

    $response = $this->getJson('/api/shop/analytics');

    $response->assertStatus(404); // Controller returns 404 if !hasShop()
});
