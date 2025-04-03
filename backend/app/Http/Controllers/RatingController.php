<?php

namespace App\Http\Controllers;

use App\Models\Rating;
use App\Models\Product;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RatingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'feedback' => 'nullable|string',
            'rate_type' => 'required|in:Product,Shop',
            'rate_id' => 'required|integer'
        ]);

        $user = Auth::guard('customer-api')->user();

        // Check if the rated item exists
        $rateableType = "App\\Models\\" . $request->rate_type;
        $rateable = $rateableType::findOrFail($request->rate_id);

        // Check for existing rating
        $existingRating = Rating::where([
            'customer_id' => $user->id,
            'rate_type' => $rateableType,
            'rate_id' => $request->rate_id
        ])->first();

        if ($existingRating) {
            return response()->json([
                'message' => 'You have already rated this ' . $request->rate_type
            ], 422);
        }

        // Create new rating
        $rating = new Rating([
            'customer_id' => $user->id,
            'rating' => $request->rating,
            'feedback' => $request->feedback
        ]);

        $rateable->ratings()->save($rating);

        return response()->json([
            'message' => $request->rate_type . ' rated successfully',
            'rating' => $rating
        ], 201);
    }

    public function getRatings(Request $request, $type, $id)
    {
        $request->validate([
            'type' => 'required|in:Product,Shop'
        ]);

        $rateableType = "App\\Models\\" . $type;
        $rateable = $rateableType::findOrFail($id);

        $ratings = $rateable->ratings()
            ->with('customer')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($ratings);
    }
}
