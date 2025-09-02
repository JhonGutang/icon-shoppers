<?php

namespace App\Interfaces\Repositories;

interface UserRepositoryInterface
{
    public function create(array $data);
    public function update(array $data, $id);
}
