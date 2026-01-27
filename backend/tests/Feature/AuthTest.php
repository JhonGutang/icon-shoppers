<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;

test('user can register with valid data', function () {
    $data = [
        'name' => 'Test User',
        'middle_name' => 'Smith',
        'email' => 'test@example.com',
        'contact_number' => '09123456789',
        'address' => 'Balamban, Cebu',
        'password' => 'password',
        'password_confirmation' => 'password',
    ];

    $response = $this->postJson('/api/register', $data);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'user' => [
                'id', 'name', 'email', 'role'
            ]
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
        'name' => 'Test User',
    ]);
});

test('registration fails with invalid email', function () {
    $data = [
        'name' => 'Test User',
        'email' => 'invalid-email',
        'contact_number' => '09123456789',
        'password' => 'password',
    ];

    $response = $this->postJson('/api/register', $data);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('user can login with valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'user@example.com',
        'password' => Hash::make('password'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'user@example.com',
        'password' => 'password',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'user',
            'token',
            'role'
        ]);
});

test('login fails with incorrect password', function () {
    $user = User::factory()->create([
        'email' => 'user@example.com',
        'password' => Hash::make('password'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'user@example.com',
        'password' => 'wrong-password',
    ]);

    $response->assertStatus(401);
});

test('authenticated user can logout', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/logout');

    $response->assertStatus(200)
        ->assertJson(['message' => 'Logged out successfully']);
    
    expect($user->tokens()->count())->toBe(0);
});

test('unauthenticated user cannot logout', function () {
    $response = $this->postJson('/api/logout');

    $response->assertStatus(401);
});
