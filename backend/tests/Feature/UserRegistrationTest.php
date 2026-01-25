<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\UserService;
use App\Interfaces\Repositories\UserRepositoryInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Mockery;

class UserRegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected $userRepository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->userRepository = Mockery::mock(UserRepositoryInterface::class);
        $this->app->instance(UserRepositoryInterface::class, $this->userRepository);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_successfully_registers_a_new_user_with_valid_data()
    {
        $validData = [
            'name' => 'John Doe',
            'middle_name' => 'Smith',
            'contact_number' => '+1234567890',
            'address' => '123 Main St, City, Country',
            'email' => 'john.doe@example.com',
            'password' => 'password123',
            'role' => 'customer'
        ];

        $hashedPassword = Hash::make('password123');
        $expectedData = array_merge($validData, ['password' => $hashedPassword]);

        $this->userRepository
            ->shouldReceive('create')
            ->once()
            ->andReturn(new User($expectedData));

        $userService = $this->app->make(UserService::class);
        $result = $userService->registerUser($validData);

        $this->assertInstanceOf(User::class, $result);
        $this->assertEquals('John Doe', $result->name);
        $this->assertEquals('john.doe@example.com', $result->email);
    }

    public function test_validates_required_fields_through_register_endpoint()
    {
        $response = $this->postJson('/api/register', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors([
                    'name',
                    'contact_number',
                    'email',
                    'password'
                ]);
    }

    public function test_validates_unique_email_constraint()
    {
        User::factory()->create([
            'email' => 'existing@example.com'
        ]);

        $duplicateData = [
            'name' => 'Another User',
            'contact_number' => '+2222222222',
            'address' => 'Another Address',
            'email' => 'existing@example.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/register', $duplicateData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }
}
