<?php

namespace App\Http\Controllers;

use App\Models\ShopRating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShopRatingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'rating_score' => 'required|integer|min:1|max:5',
            'shop_id' => 'required|exists:shops,id',
            'feedback' => 'nullable|string'
        ]);

        $user = Auth::guard('customer-api')->user();

        $existingRating = ShopRating::where([
            'customer_id' => $user->id,
            'shop_id' => $request->shop_id
        ])->first();

        if ($existingRating) {
            return response()->json([
                'message' => 'You have already rated this shop.'
            ], 422);
        }

        $rating = ShopRating::create([
            'customer_id' => $user->id,
            'shop_id' => $request->shop_id,
            'rating_score' => $request->rating_score,
            'feedback' => $request->feedback
        ]);

        return response()->json([
            'message' => 'Shop rated successfully.',
            'rating' => $rating
        ], 201);
    }

    public function getShopRatings($shopId)
    {
        $ratings = ShopRating::with('customer')
            ->where('shop_id', $shopId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($ratings);
    }
}
