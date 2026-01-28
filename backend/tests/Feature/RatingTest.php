<?php

use App\Models\Product;
use App\Models\ProductRating;

test('anyone can fetch product rating summary', function () {
    $product = Product::factory()->create();
    ProductRating::factory()->create(['product_id' => $product->id, 'rating' => 5]);
    ProductRating::factory()->create(['product_id' => $product->id, 'rating' => 4]);

    $response = $this->getJson("/api/product-ratings/{$product->id}");

    $response->assertStatus(200)
        ->assertJson([
            'total' => 2,
            'average' => 4.5,
        ]);
});

test('authenticated customer can rate a product', function () {
    $user = $this->actingAsCustomer();
    $product = Product::factory()->create();

    $data = [
        'product_id' => $product->id,
        'rating' => 5,
        'feedback' => 'Amazing quality!',
    ];

    $response = $this->postJson('/api/customer/product-ratings', $data);

    $response->assertStatus(201);
    $this->assertDatabaseHas('product_ratings', [
        'user_id' => $user->id,
        'product_id' => $product->id,
        'rating' => 5,
        'feedback' => 'Amazing quality!',
    ]);
});

test('customer cannot rate the same product twice', function () {
    $user = $this->actingAsCustomer();
    $product = Product::factory()->create();
    ProductRating::factory()->create([
        'user_id' => $user->id,
        'product_id' => $product->id,
    ]);

    $data = [
        'product_id' => $product->id,
        'rating' => 4,
    ];

    $response = $this->postJson('/api/customer/product-ratings', $data);

    $response->assertStatus(409); // Conflict
});

test('rating validation checks for 1-5 range', function () {
    $user = $this->actingAsCustomer();
    $product = Product::factory()->create();

    $response = $this->postJson('/api/customer/product-ratings', [
        'product_id' => $product->id,
        'rating' => 6,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['rating']);
});
