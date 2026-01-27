<?php

use App\Models\User;
use App\Models\Product;
use App\Models\Shop;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('anyone can fetch all products', function () {
    Product::factory()->count(3)->create(['is_visible' => true]);
    Product::factory()->create(['is_visible' => false]);

    $response = $this->getJson('/api/products/all');

    $response->assertStatus(200)
        ->assertJsonCount(3, 'data');
});

test('anyone can search for products', function () {
    $uniqueName = 'ZYX-UNIQUE-APPLE-' . uniqid();
    Product::factory()->create(['name' => $uniqueName, 'is_visible' => true]);
    Product::factory()->create(['name' => 'Other Random Product', 'is_visible' => true]);

    $response = $this->getJson("/api/products/search?search={$uniqueName}");

    $response->assertStatus(200)
        ->assertJsonCount(1, 'data')
        ->assertJsonFragment(['name' => $uniqueName]);
});

test('anyone can view a specific product', function () {
    $product = Product::factory()->create(['is_visible' => true]);

    $response = $this->getJson("/api/products/{$product->id}");

    $response->assertStatus(200)
        ->assertJsonFragment(['name' => $product->name]);
});

test('merchant can view their products', function () {
    $merchant = $this->actingAsMerchant();
    Product::factory()->count(2)->create(['shop_id' => $merchant->shop->id]);
    Product::factory()->create(); // Another shop's product

    $response = $this->getJson('/api/merchant/products');

    $response->assertStatus(200)
        ->assertJsonCount(2);
});

test('merchant can create a product', function () {
    Storage::fake('public');
    $merchant = $this->actingAsMerchant();

    $data = [
        'name' => 'New Test Product',
        'price' => 150.00,
        'quantity' => 10,
        'description' => 'Great product',
        'image' => UploadedFile::fake()->create('product.jpg', 100)
    ];

    $response = $this->postJson('/api/merchant/products', $data);

    $response->assertStatus(201)
        ->assertJsonFragment(['name' => 'New Test Product']);
    
    $this->assertDatabaseHas('products', [
        'name' => 'New Test Product',
        'shop_id' => $merchant->shop->id
    ]);
});

test('merchant can update their product', function () {
    $merchant = $this->actingAsMerchant();
    $product = Product::factory()->create(['shop_id' => $merchant->shop->id]);

    $response = $this->postJson("/api/merchant/products/{$product->id}", [
        'name' => 'Updated Name',
        'price' => 200.00,
        'quantity' => 50
    ]);

    $response->assertStatus(200)
        ->assertJsonFragment(['name' => 'Updated Name']);
    
    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'name' => 'Updated Name',
        'price' => 200.00,
        'quantity' => 50
    ]);
});

test('merchant cannot update someone elses product', function () {
    $merchant = $this->actingAsMerchant();
    $otherProduct = Product::factory()->create();

    $response = $this->postJson("/api/merchant/products/{$otherProduct->id}", [
        'name' => 'Hacker Update',
        'price' => 1000.00,
        'quantity' => 1
    ]);

    $response->assertStatus(403);
});

test('merchant can delete their product', function () {
    $merchant = $this->actingAsMerchant();
    $product = Product::factory()->create(['shop_id' => $merchant->shop->id]);

    $response = $this->deleteJson("/api/merchant/products/{$product->id}");

    $response->assertStatus(200);
    $this->assertDatabaseMissing('products', ['id' => $product->id]);
});
