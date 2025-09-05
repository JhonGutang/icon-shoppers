<?php

namespace App\Interfaces\Repositories;

interface OrderRepositoryInterface
{
    public function all($statusId, $shopId);
    public function update($statusId, $shopId);

}
