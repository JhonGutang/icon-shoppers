<?php

namespace App\Repositories;

use App\Interfaces\Repositories\UserRepositoryInterface;
use App\Models\Shop;

class ShopRepository implements UserRepositoryInterface
{
    public function create(array $data)
    {
        return Shop::create($data);
    }

    public function update(array $data, $id)
    {
        $shop = Shop::findOrFail($id);
        $shop->update($data);
        return $shop;
    }
}
