<?php

namespace App\Repositories;

use App\Interfaces\Repositories\UserRepositoryInterface;
use App\Models\Customer;

class CustomerRepository implements UserRepositoryInterface
{
    public function create(array $data)
    {
        return Customer::create($data);
    }

    public function update(array $data, $id)
    {
        $customer = Customer::findOrFail($id);
        $customer->update($data);
        return $customer;
    }
}
