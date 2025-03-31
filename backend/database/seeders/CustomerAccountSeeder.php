<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Customer;

class CustomerAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = [
            [
                'name' => 'John',
                'middle_name' => 'Doe',
                'contact_number' => '09123456777',
                'address' => '123 Main Street, Manila',
                'email' => 'john1.doe@example.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Jane',
                'middle_name' => 'Smith',
                'contact_number' => '09187654321',
                'address' => '456 Park Avenue, Makati',
                'email' => 'jane.smith@example.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Michael',
                'middle_name' => 'Johnson',
                'contact_number' => '09198765432',
                'address' => '789 Ocean Drive, Cebu',
                'email' => 'michael.johnson@example.com',
                'password' => Hash::make('password'),
            ]
        ];

        foreach ($customers as $customerData) {
            Customer::create($customerData);
        }

    }
}
