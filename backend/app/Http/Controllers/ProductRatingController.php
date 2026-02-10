<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRatingRequest;
use App\Http\Requests\UpdateProductRatingRequest;
use App\Interfaces\Services\ProductRatingServiceInterface;

class ProductRatingController extends Controller
{
    protected $ratingService;

    public function __construct(ProductRatingServiceInterface $ratingService)
    {
        $this->ratingService = $ratingService;
    }

    public function index($productId)
    {
        $ratings = $this->ratingService->getProductRatings($productId);

        return response()->json([
            'ratings' => $ratings,
            'total' => $ratings->count(),
            'average' => round($ratings->avg('rating'), 2),
        ]);
    }

    public function store(StoreProductRatingRequest $request)
    {
        $rating = $this->ratingService->submitRating($request->validated());

        return response()->json($rating, 201);
    }

    public function show($id)
    {
        $rating = $this->ratingService->getRating($id);

        return response()->json($rating);
    }

    public function update(UpdateProductRatingRequest $request, $id)
    {
        $rating = $this->ratingService->updateRating($id, $request->validated());

        return response()->json($rating);
    }

    public function destroy($id)
    {
        $this->ratingService->deleteRating($id);

        return response()->json(['message' => 'Rating deleted.']);
    }
}
