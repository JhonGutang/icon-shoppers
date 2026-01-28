<?php

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('authenticated user can view their unified profile', function () {
    $user = $this->actingAsCustomer();

    $response = $this->getJson('/api/profile');

    $response->assertStatus(200);
});

test('merchant can update their unified profile', function () {
    Storage::fake('public');
    $merchant = $this->actingAsMerchant();

    $data = [
        'user_name' => 'Updated User Name',
        'contact_number' => '09998887777',
        'shop_name' => 'Updated Shop Name',
        'description' => 'Updated description',
        'logo_image' => UploadedFile::fake()->create('logo.jpg', 100),
        'banner_image' => UploadedFile::fake()->create('banner.jpg', 100),
    ];

    $response = $this->postJson('/api/profile', $data);

    $response->assertStatus(200)
        ->assertJsonFragment(['message' => 'Profile updated successfully']);

    $this->assertDatabaseHas('users', [
        'id' => $merchant->id,
        'name' => 'Updated User Name',
        'contact_number' => '09998887777',
    ]);

    $this->assertDatabaseHas('shops', [
        'id' => $merchant->shop->id,
        'name' => 'Updated Shop Name',
        'description' => 'Updated description',
    ]);
});

test('unauthenticated user cannot view profile', function () {
    $response = $this->getJson('/api/profile');

    $response->assertStatus(401);
});
