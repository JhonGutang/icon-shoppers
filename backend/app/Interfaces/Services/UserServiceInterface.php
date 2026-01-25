<?php

namespace App\Interfaces\Services;
interface UserServiceInterface
{
    /**
     * Login a customer with given credentials.
     *
     * @param array $credentials
     * @return mixed
     */
    public function authenticateUser(array $credentials);
    public function registerUser(array $userData);
    public function updateUser(array $userData, int $id);
}
