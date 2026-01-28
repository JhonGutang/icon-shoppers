<?php

namespace Tests;

use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    /**
     * Create and authenticate as a customer.
     */
    protected function actingAsCustomer(?User $user = null): User
    {
        $user = $user ?? User::factory()->create(['role' => User::ROLE_CUSTOMER]);

        $this->actingAs($user, 'sanctum');

        return $user;
    }

    /**
     * Create and authenticate as a merchant with a shop.
     */
    protected function actingAsMerchant(?User $user = null, ?array $shopAttributes = []): User
    {
        $user = $user ?? User::factory()->create(['role' => User::ROLE_MERCHANT]);

        Shop::factory()->create(array_merge([
            'owner_id' => $user->id,
            'name' => 'Test Shop',
        ], $shopAttributes));

        $this->actingAs($user, 'sanctum');

        return $user->load('shop');
    }

    /**
     * Helper to create a product.
     */
    protected function createProduct(array $attributes = []): Product
    {
        return Product::factory()->create($attributes);
    }

    /**
     * Create a shop owner role for an existing user.
     */
    protected function makeMerchant(User $user): Shop
    {
        $user->update(['role' => User::ROLE_MERCHANT]);

        return Shop::factory()->create([
            'owner_id' => $user->id,
            'name' => $user->name."'s Shop",
        ]);
    }
}
