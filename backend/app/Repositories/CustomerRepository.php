<?php

namespace App\Repositories;

use App\Interfaces\Repositories\CustomerRepositoryInterface;
use App\Models\Customer;

class CustomerRepository implements CustomerRepositoryInterface
{
    public function create(array $data)
    {
        return Customer::create($data);
    }
}
