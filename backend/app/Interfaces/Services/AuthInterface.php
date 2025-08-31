<?php

namespace App\Interfaces\Services;

interface AuthInterface
{
    /**
     * Login a customer with given credentials.
     *
     * @param array $credentials
     * @return mixed
     */
    public function authenticateCustomer(array $credentials);
}
