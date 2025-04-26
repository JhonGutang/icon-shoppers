<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductRating;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProductRatingController extends Controller
{
    /**
     * Display a listing of the ratings for a product.
     */
    public function index($productId)
    {
        $product = Product::findOrFail($productId);
    
        $ratings = $product->ratings()->with('customer')->latest()->get();
    
        $totalRatings = $ratings->count();
        $averageRating = $ratings->avg('rating');
    
        return response()->json([
            'total' => $totalRatings,
            'average' => round($averageRating, 2),
        ]);
    }
    


    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'feedback' => ['nullable', 'string', 'max:1000'],
        ]);
    
        $user = Auth::guard('customer-api')->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized.'], 401);
        }
        $customerId = $user->id;
    
        $product = Product::findOrFail($validated['product_id']);
    
        if ($product->ratings()->where('customer_id', $customerId)->exists()) {
            return response()->json(['message' => 'You have already rated this product.'], 409);
        }
    
        try {
            $rating = $product->ratings()->create([
                'customer_id' => $customerId,
                'rating' => $validated['rating'],
                'feedback' => $validated['feedback'],
            ]);
        } catch (QueryException $e) {
            if ($e->errorInfo[1] == 1062) { 
                return response()->json(['message' => 'You have already rated this product.'], 409);
            }
            report($e); 
            return response()->json(['message' => 'Failed to save rating.'], 500);
        }
    
        return response()->json($rating, 201);
    }

    /**
     * Show a specific rating.
     */
    public function show(Product $product, ProductRating $rating)
    {
        $this->authorizeRatingAccess($rating, $product);
        return response()->json($rating->load('customer'));
    }

    /**
     * Update an existing rating.
     */
    public function update(Request $request, Product $product, ProductRating $rating)
    {
        $this->authorizeRatingAccess($rating, $product);

        $request->validate([
            'rating' => ['required', 'integer', 'between:1,5'],
            'feedback' => ['nullable', 'string', 'max:1000'],
        ]);

        $rating->update([
            'rating' => $request->rating,
            'feedback' => $request->feedback,
        ]);

        // Optionally update summary again
        // UpdateProductRatingSummary::dispatch($product);

        return response()->json($rating);
    }

    /**
     * Remove a rating.
     */
    public function destroy(Product $product, ProductRating $rating)
    {
        $this->authorizeRatingAccess($rating, $product);

        $rating->delete();

        // Optionally update summary again
        // UpdateProductRatingSummary::dispatch($product);

        return response()->json(['message' => 'Rating deleted.']);
    }

    /**
     * Ensure the rating belongs to this product and this customer.
     */
    private function authorizeRatingAccess(ProductRating $rating, Product $product)
    {
        if ($rating->product_id !== $product->id) {
            abort(404, 'Rating does not belong to this product.');
        }

        if ($rating->customer_id !== Auth::guard('customer')->id()) {
            abort(403, 'Unauthorized.');
        }
    }
}
