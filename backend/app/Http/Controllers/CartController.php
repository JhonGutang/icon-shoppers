<?php

namespace App\Http\Controllers;

use App\Interfaces\Services\CartServiceInterface;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    protected $cartService;
    public function __construct(CartServiceInterface $cartService)
    {
        $this->cartService = $cartService;
    }


    public function index()
    {
        $userId = Auth::id();
        $cartItems = $this->cartService->getCartItems($userId);
        return response()->json($cartItems);
    }


    public function store($id)
    {
        $userId = Auth::id();
        $this->cartService->addToCart($userId, $id);
        return response()->json(['message' => 'Product added to cart successfully']);
    }


    public function delete($productId)
    {
        $userId = Auth::id();
        $this->cartService->removeToCart($userId, $productId);
        return response()->json(['message' => 'Product removed from cart successfully.'], 200);
    }
}
