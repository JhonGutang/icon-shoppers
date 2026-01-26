<?php

namespace App\Http\Controllers;

use App\Interfaces\Services\WishlistServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    protected $wishlistService;

    public function __construct(WishlistServiceInterface $wishlistService)
    {
        $this->wishlistService = $wishlistService;
    }

    public function index(Request $request)
    {
        $userId = Auth::id();
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 20);

        $wishlist = $this->wishlistService->getUserWishlist($userId, $page, $perPage);
        return response()->json($wishlist);
    }

    public function store(Request $request)
    {
        $userId = Auth::id();
        $productId = $request->input('product_id');

        $result = $this->wishlistService->addToWishlist($userId, $productId);
        return response()->json($result);
    }

    public function destroy($productId)
    {
        $userId = Auth::id();
        $this->wishlistService->removeFromWishlist($userId, $productId);
        return response()->json(['message' => 'Product removed from wishlist']);
    }

    public function toggle(Request $request)
    {
        $userId = Auth::id();
        $productId = $request->input('product_id');

        $result = $this->wishlistService->toggleWishlist($userId, $productId);
        return response()->json($result);
    }
}
