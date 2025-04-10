<?php

namespace App\Http\Controllers;

use App\Models\ProductRating;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductRatingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'rating_score' => 'required|integer|min:1|max:5',
            'product_id' => 'required|exists:products,id',
            'feedback' => 'nullable|string'
        ]);

        $user = Auth::guard('customer-api')->user();

        $existingRating = ProductRating::where([
            'customer_id' => $user->id,
            'product_id' => $request->product_id
        ])->first();

        if ($existingRating) {
            return response()->json([
                'message' => 'You have already rated this product.'
            ], 422);
        }

        $rating = ProductRating::create([
            'customer_id' => $user->id,
            'product_id' => $request->product_id,
            'rating_score' => $request->rating_score,
            'feedback' => $request->feedback
        ]);

        return response()->json([
            'message' => 'Product rated successfully.',
            'rating' => $rating
        ], 201);
    }

    public function getProductRatings($productId)
    {
        $ratings = ProductRating::with('customer')
            ->where('product_id', $productId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($ratings);
    }
}
