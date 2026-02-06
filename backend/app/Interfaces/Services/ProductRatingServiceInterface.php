<?php

namespace App\Interfaces\Services;

interface ProductRatingServiceInterface
{
    public function getProductRatings(int $productId);

    public function getRating(int $id);

    public function submitRating(array $data);

    public function updateRating(int $id, array $data);

    public function deleteRating(int $id);
}
