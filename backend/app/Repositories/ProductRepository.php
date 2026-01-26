<?php

namespace App\Repositories;

use App\Interfaces\Repositories\ProductRepositoryInterface;
use App\Models\Product;

class ProductRepository implements ProductRepositoryInterface
{
    public function findProducts($ids)
    {
        $products = Product::with('shop')->whereIn('id', $ids)->get()->keyBy('id');
        return $products;
    }
}
