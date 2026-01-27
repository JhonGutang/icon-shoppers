<?php

use App\Models\User;
use App\Models\Product;
use App\Models\Cart;
use App\Models\CartItem;

test('authenticated customer can view their cart', function () {
    $user = $this->actingAsCustomer();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    CartItem::factory()->count(2)->create(['cart_id' => $cart->id]);

    $response = $this->getJson('/api/to-checkout');

    $response->assertStatus(200)
        ->assertJsonCount(2);
});

test('authenticated customer can add product to cart', function () {
    $user = $this->actingAsCustomer();
    $product = Product::factory()->create(['quantity' => 10]);

    $response = $this->postJson("/api/cart/{$product->id}");

    $response->assertStatus(200)
        ->assertJson(['message' => 'Product added to cart successfully']);
    
    $this->assertDatabaseHas('cart_items', [
        'product_id' => $product->id,
    ]);
});

test('authenticated customer can remove item from cart', function () {
    $user = $this->actingAsCustomer();
    $cart = Cart::factory()->create(['user_id' => $user->id]);
    $cartItem = CartItem::factory()->create(['cart_id' => $cart->id]);

    $response = $this->deleteJson("/api/cart-item/{$cartItem->id}");

    $response->assertStatus(200)
        ->assertJson(['message' => 'Product removed from cart successfully.']);
    
    $this->assertDatabaseMissing('cart_items', ['id' => $cartItem->id]);
});

test('unauthenticated user cannot access cart', function () {
    $response = $this->getJson('/api/to-checkout');

    $response->assertStatus(401);
});
