<?php

namespace App\Repositories;

use App\Interfaces\Repositories\ProductRatingRepositoryInterface;
use App\Models\ProductRating;

class ProductRatingRepository implements ProductRatingRepositoryInterface
{
    protected $model;

    public function __construct(ProductRating $productRating)
    {
        $this->model = $productRating;
    }

    public function getByProductId(int $productId)
    {
        return $this->model->with('user')->where('product_id', $productId)->latest()->get();
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data)
    {
        $rating = $this->findById($id);
        $rating->update($data);

        return $rating;
    }

    public function delete(int $id)
    {
        $rating = $this->findById($id);

        return $rating->delete();
    }

    public function findById(int $id)
    {
        return $this->model->findOrFail($id);
    }
}
