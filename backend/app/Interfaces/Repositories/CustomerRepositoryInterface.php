<?php

namespace App\Interfaces\Repositories;

interface CustomerRepositoryInterface
{
    public function create(array $data);
    public function update(array $data, $id);
}
