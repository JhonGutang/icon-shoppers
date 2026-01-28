<?php

use App\Models\Product;
use App\Models\Shop;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('products can be sorted by price ascending', function () {
    Product::factory()->create(['price' => 100, 'is_visible' => true]);
    Product::factory()->create(['price' => 50, 'is_visible' => true]);
    Product::factory()->create(['price' => 150, 'is_visible' => true]);

    $response = $this->getJson('/api/products/all?sort=price_asc');

    $response->assertStatus(200);
    $data = $response->json('data');

    expect($data[0]['price'])->toEqual(50);
    expect($data[1]['price'])->toEqual(100);
    expect($data[2]['price'])->toEqual(150);
});

test('products can be sorted by price descending', function () {
    Product::factory()->create(['price' => 100, 'is_visible' => true]);
    Product::factory()->create(['price' => 50, 'is_visible' => true]);
    Product::factory()->create(['price' => 150, 'is_visible' => true]);

    $response = $this->getJson('/api/products/all?sort=price_desc');

    $response->assertStatus(200);
    $data = $response->json('data');

    expect($data[0]['price'])->toEqual(150);
    expect($data[1]['price'])->toEqual(100);
    expect($data[2]['price'])->toEqual(50);
});

test('products can be sorted by featured status', function () {
    Product::factory()->create(['is_featured' => false, 'name' => 'Normal 1', 'is_visible' => true]);
    Product::factory()->create(['is_featured' => true, 'name' => 'Featured 1', 'is_visible' => true]);
    Product::factory()->create(['is_featured' => false, 'name' => 'Normal 2', 'is_visible' => true]);

    $response = $this->getJson('/api/products/all?sort=featured');

    $response->assertStatus(200);
    $data = $response->json('data');

    expect($data[0]['is_featured'])->toBe(true);
    expect($data[1]['is_featured'])->toBe(false);
});

test('shops can be sorted by name', function () {
    Shop::factory()->create(['name' => 'Z Shop', 'status' => Shop::STATUS_ACTIVE]);
    Shop::factory()->create(['name' => 'A Shop', 'status' => Shop::STATUS_ACTIVE]);
    Shop::factory()->create(['name' => 'M Shop', 'status' => Shop::STATUS_ACTIVE]);

    $response = $this->getJson('/api/shops?sort=name_asc');

    $response->assertStatus(200);
    $data = $response->json('data');

    expect($data[0]['name'])->toBe('A Shop');
    expect($data[1]['name'])->toBe('M Shop');
    expect($data[2]['name'])->toBe('Z Shop');
});

test('shops can be searched and sorted', function () {
    Shop::factory()->create(['name' => 'Apple Store', 'status' => Shop::STATUS_ACTIVE]);
    Shop::factory()->create(['name' => 'Banana Store', 'status' => Shop::STATUS_ACTIVE]);
    Shop::factory()->create(['name' => 'Carrot Shop', 'status' => Shop::STATUS_ACTIVE]);

    $response = $this->getJson('/api/shops?search=Store&sort=name_asc');

    $response->assertStatus(200);
    $data = $response->json('data');

    expect(count($data))->toBe(2);
    expect($data[0]['name'])->toBe('Apple Store');
    expect($data[1]['name'])->toBe('Banana Store');
});
