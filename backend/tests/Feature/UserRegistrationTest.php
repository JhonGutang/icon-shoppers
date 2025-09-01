<?php

use App\Models\Customer;
use App\Services\AuthService;
use App\Interfaces\Repositories\CustomerRepositoryInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Mock the CustomerRepositoryInterface
    $this->customerRepository = Mockery::mock(CustomerRepositoryInterface::class);
    $this->app->instance(CustomerRepositoryInterface::class, $this->customerRepository);
});

afterEach(function () {
    Mockery::close();
});

describe('Customer Registration', function () {
    
    test('successfully registers a new customer with valid data', function () {
        $validData = [
            'name' => 'John Doe',
            'middle_name' => 'Smith',
            'contact_number' => '+1234567890',
            'address' => '123 Main St, City, Country',
            'email' => 'john.doe@example.com',
            'password' => 'password123'
        ];

        $hashedPassword = Hash::make('password123');
        $expectedData = array_merge($validData, ['password' => $hashedPassword]);

        $this->customerRepository
            ->shouldReceive('create')
            ->once()
            ->with(Mockery::on(function ($data) use ($validData) {
                // Check that all fields are present and password is hashed
                return $data['name'] === $validData['name'] &&
                       $data['middle_name'] === $validData['middle_name'] &&
                       $data['contact_number'] === $validData['contact_number'] &&
                       $data['address'] === $validData['address'] &&
                       $data['email'] === $validData['email'] &&
                       Hash::check($validData['password'], $data['password']);
            }))
            ->andReturn(new Customer($expectedData));

        $authService = new AuthService($this->customerRepository);
        $result = $authService->registerUser($validData);

        expect($result)->toBeInstanceOf(Customer::class);
        expect($result->name)->toBe('John Doe');
        expect($result->email)->toBe('john.doe@example.com');
    });

    test('successfully registers customer without middle name', function () {
        $validData = [
            'name' => 'Jane Doe',
            'contact_number' => '+0987654321',
            'address' => '456 Oak Ave, Town, Country',
            'email' => 'jane.doe@example.com',
            'password' => 'password456'
        ];

        $this->customerRepository
            ->shouldReceive('create')
            ->once()
            ->andReturn(new Customer($validData));

        $authService = new AuthService($this->customerRepository);
        $result = $authService->registerUser($validData);

        expect($result)->toBeInstanceOf(Customer::class);
        expect($result->middle_name)->toBeNull();
    });

    test('handles database transaction rollback on error', function () {
        $validData = [
            'name' => 'Test User',
            'contact_number' => '+1111111111',
            'address' => '789 Test St, Test City',
            'email' => 'test@example.com',
            'password' => 'password789'
        ];

        $this->customerRepository
            ->shouldReceive('create')
            ->once()
            ->andThrow(new Exception('Database connection failed'));

        $authService = new AuthService($this->customerRepository);
        $result = $authService->registerUser($validData);

        expect($result)->toBeInstanceOf(\Illuminate\Http\JsonResponse::class);
        expect($result->getData())->toHaveKey('error');
        expect($result->getData()->error)->toBe('Registration failed');
        expect($result->getData()->message)->toBe('Database connection failed');
    });

    test('validates required fields through CustomerRequest', function () {
        $response = $this->postJson('/api/customer-register', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors([
                    'name',
                    'contact_number',
                    'address',
                    'email',
                    'password'
                ]);
    });

    test('validates email format', function () {
        $invalidData = [
            'name' => 'Test User',
            'contact_number' => '+1111111111',
            'address' => 'Test Address',
            'email' => 'invalid-email',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/customer-register', $invalidData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    });

    test('validates password minimum length', function () {
        $invalidData = [
            'name' => 'Test User',
            'contact_number' => '+1111111111',
            'address' => 'Test Address',
            'email' => 'test@example.com',
            'password' => '123' // Less than minimum 4 characters
        ];

        $response = $this->postJson('/api/customer-register', $invalidData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['password']);
    });

    test('validates string fields are not numeric', function () {
        $invalidData = [
            'name' => 123,
            'contact_number' => '+1111111111',
            'address' => 'Test Address',
            'email' => 'test@example.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/customer-register', $invalidData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['name']);
    });

    test('validates field maximum lengths', function () {
        $longString = str_repeat('a', 256); // Exceeds 255 max length
        
        $invalidData = [
            'name' => $longString,
            'contact_number' => '+1111111111',
            'address' => 'Test Address',
            'email' => 'test@example.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/customer-register', $invalidData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['name']);
    });

    test('validates address maximum length', function () {
        $longAddress = str_repeat('a', 501); // Exceeds 500 max length
        
        $invalidData = [
            'name' => 'Test User',
            'contact_number' => '+1111111111',
            'address' => $longAddress,
            'email' => 'test@example.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/customer-register', $invalidData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['address']);
    });

    test('validates contact number maximum length', function () {
        $longContact = str_repeat('1', 21); // Exceeds 20 max length
        
        $invalidData = [
            'name' => 'Test User',
            'contact_number' => $longContact,
            'address' => 'Test Address',
            'email' => 'test@example.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/customer-register', $invalidData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['contact_number']);
    });

    test('validates email maximum length', function () {
        $longEmail = str_repeat('a', 250) . '@example.com'; // Exceeds 255 max length (250 + 11 = 261)
        
        $invalidData = [
            'name' => 'Test User',
            'contact_number' => '+1111111111',
            'address' => 'Test Address',
            'email' => $longEmail,
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/customer-register', $invalidData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    });

    test('validates unique email constraint', function () {
        // First, create a customer with the email
        $existingCustomer = Customer::factory()->create([
            'email' => 'existing@example.com'
        ]);

        // Verify the customer was created
        $this->assertDatabaseHas('customers', [
            'email' => 'existing@example.com'
        ]);

        $duplicateData = [
            'name' => 'Another User',
            'contact_number' => '+2222222222',
            'address' => 'Another Address',
            'email' => 'existing@example.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/customer-register', $duplicateData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    });

    test('validates unique contact number constraint', function () {
        // First, create a customer with the contact number
        $existingCustomer = Customer::factory()->create([
            'contact_number' => '+3333333333'
        ]);

        // Verify the customer was created
        $this->assertDatabaseHas('customers', [
            'contact_number' => '+3333333333'
        ]);

        $duplicateData = [
            'name' => 'Another User',
            'contact_number' => '+3333333333',
            'address' => 'Another Address',
            'email' => 'another@example.com',
            'password' => 'password123'
        ];

        $response = $this->postJson('/api/customer-register', $duplicateData);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['contact_number']);
    });

    test('returns proper success response structure', function () {
        $validData = [
            'name' => 'Success User',
            'contact_number' => '+4444444444',
            'middle_name' => 'Success Middle Name',
            'address' => 'Success Address',
            'email' => 'success@example.com',
            'password' => 'password123'
        ];

        // Create a mock Customer with all required fields including ID
        $mockCustomer = new Customer($validData);
        $mockCustomer->id = 1;
        $mockCustomer->created_at = now();
        $mockCustomer->updated_at = now();

        $this->customerRepository
            ->shouldReceive('create')
            ->once()
            ->andReturn($mockCustomer);

        $response = $this->postJson('/api/customer-register', $validData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'message',
                    'customer' => [
                        'id',
                        'name',
                        'middle_name',
                        'contact_number',
                        'address',
                        'email',
                        'created_at',
                        'updated_at'
                    ]
                ])
                ->assertJson([
                    'message' => 'Customer created successfully.'
                ]);
    });

    test('handles database connection issues gracefully', function () {
        $validData = [
            'name' => 'Test User',
            'contact_number' => '+5555555555',
            'address' => 'Test Address',
            'email' => 'test@example.com',
            'password' => 'password123'
        ];

        $this->customerRepository
            ->shouldReceive('create')
            ->once()
            ->andThrow(new Exception('Connection refused'));

        $authService = new AuthService($this->customerRepository);
        $result = $authService->registerUser($validData);

        expect($result)->toBeInstanceOf(\Illuminate\Http\JsonResponse::class);
        expect($result->getData())->toHaveKey('error');
        expect($result->getData()->error)->toBe('Registration failed');
    });

    test('password is properly hashed before storage', function () {
        $validData = [
            'name' => 'Hash Test User',
            'contact_number' => '+6666666666',
            'address' => 'Hash Test Address',
            'email' => 'hash@example.com',
            'password' => 'plaintextpassword'
        ];

        $this->customerRepository
            ->shouldReceive('create')
            ->once()
            ->with(Mockery::on(function ($data) use ($validData) {
                // Verify password is hashed
                return Hash::check($validData['password'], $data['password']) &&
                       $data['password'] !== $validData['password'];
            }))
            ->andReturn(new Customer($validData));

        $authService = new AuthService($this->customerRepository);
        $result = $authService->registerUser($validData);

        expect($result)->toBeInstanceOf(Customer::class);
    });

    test('middle name is optional and can be null', function () {
        $validData = [
            'name' => 'Optional Middle User',
            'contact_number' => '+7777777777',
            'address' => 'Optional Address',
            'email' => 'optional@example.com',
            'password' => 'password123'
        ];

        $this->customerRepository
            ->shouldReceive('create')
            ->once()
            ->andReturn(new Customer($validData));

        $authService = new AuthService($this->customerRepository);
        $result = $authService->registerUser($validData);

        expect($result)->toBeInstanceOf(Customer::class);
        expect($result->middle_name)->toBeNull();
    });

    test('middle name can be empty string and gets stored', function () {
        $validData = [
            'name' => 'Empty Middle User',
            'middle_name' => '',
            'contact_number' => '+8888888888',
            'address' => 'Empty Middle Address',
            'email' => 'empty@example.com',
            'password' => 'password123'
        ];

        $this->customerRepository
            ->shouldReceive('create')
            ->once()
            ->andReturn(new Customer($validData));

        $authService = new AuthService($this->customerRepository);
        $result = $authService->registerUser($validData);

        expect($result)->toBeInstanceOf(Customer::class);
        expect($result->middle_name)->toBe('');
    });
});
