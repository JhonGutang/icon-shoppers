<?php

namespace App\Interfaces\Repositories;

interface OrderRepositoryInterface
{
    public function all($status, $shopId);

}
