<?php

namespace App\Interfaces\Repositories;

interface UserRepositoryInterface
{
    public function getUser(int $userId);

    public function findByEmail(string $email);

    public function all();

    public function create(array $data);

    public function update(array $data, $id);
}
