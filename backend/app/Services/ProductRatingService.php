<?php

namespace App\Services;

use App\Interfaces\Repositories\ProductRatingRepositoryInterface;
use App\Interfaces\Services\ProductRatingServiceInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class ProductRatingService implements ProductRatingServiceInterface
{
    protected $ratingRepository;

    public function __construct(ProductRatingRepositoryInterface $ratingRepository)
    {
        $this->ratingRepository = $ratingRepository;
    }

    public function getProductRatings(int $productId)
    {
        return $this->ratingRepository->getByProductId($productId);
    }

    public function getRating(int $id)
    {
        return $this->ratingRepository->findById($id);
    }

    public function submitRating(array $data)
    {
        $userId = Auth::id();

        // Check if user already rated this product
        $existing = $this->ratingRepository->getByProductId($data['product_id'])
            ->where('user_id', $userId)
            ->first();

        if ($existing) {
            throw ValidationException::withMessages([
                'product_id' => ['You have already rated this product.'],
            ]);
        }

        $data['user_id'] = $userId;

        return $this->ratingRepository->create($data);
    }

    public function updateRating(int $id, array $data)
    {
        $rating = $this->ratingRepository->findById($id);

        if ($rating->user_id !== Auth::id()) {
            throw new \Exception('Unauthorized', 403);
        }

        return $this->ratingRepository->update($id, $data);
    }

    public function deleteRating(int $id)
    {
        $rating = $this->ratingRepository->findById($id);

        if ($rating->user_id !== Auth::id()) {
            throw new \Exception('Unauthorized', 403);
        }

        return $this->ratingRepository->delete($id);
    }
}
