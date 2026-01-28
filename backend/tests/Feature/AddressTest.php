<?php

use App\Models\User;
use App\Models\Address;
use Laravel\Sanctum\Sanctum;

test('authenticated user can view their addresses', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);
    Address::factory()->count(3)->create(['user_id' => $user->id]);

    $response = $this->getJson('/api/addresses');

    $response->assertStatus(200)
        ->assertJsonCount(3);
});

test('user can create a new address', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $data = [
        'name' => 'John Doe',
        'phone' => '09123456789',
        'street' => '123 Main St',
        'barangay' => 'Brgy 1',
        'city' => 'Metro Manila',
        'postal_code' => '1000',
        'is_default' => true
    ];

    $response = $this->postJson('/api/addresses', $data);

    $response->assertStatus(201)
        ->assertJsonFragment(['name' => 'John Doe']);
    
    $this->assertDatabaseHas('addresses', [
        'user_id' => $user->id,
        'name' => 'John Doe',
        'is_default' => 1
    ]);
});

test('user can update their address', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);
    $address = Address::factory()->create(['user_id' => $user->id]);

    $data = ['name' => 'Updated Name'];

    $response = $this->putJson("/api/addresses/{$address->id}", $data);

    $response->assertStatus(200)
        ->assertJsonFragment(['name' => 'Updated Name']);
    
    $this->assertDatabaseHas('addresses', [
        'id' => $address->id,
        'name' => 'Updated Name'
    ]);
});

test('user can delete their address', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);
    $address = Address::factory()->create(['user_id' => $user->id]);

    $response = $this->deleteJson("/api/addresses/{$address->id}");

    $response->assertStatus(200);
    $this->assertDatabaseMissing('addresses', ['id' => $address->id]);
});

test('user can set an address as default', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);
    $address1 = Address::factory()->create(['user_id' => $user->id, 'is_default' => true]);
    $address2 = Address::factory()->create(['user_id' => $user->id, 'is_default' => false]);

    $response = $this->postJson("/api/addresses/{$address2->id}/set-default");

    $response->assertStatus(200);
    
    $this->assertDatabaseHas('addresses', ['id' => $address2->id, 'is_default' => 1]);
    $this->assertDatabaseHas('addresses', ['id' => $address1->id, 'is_default' => 0]);
});
