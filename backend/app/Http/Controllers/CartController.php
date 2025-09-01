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
        $userId = Auth::guard('customer-api')->user()->id;
        $cartItems = $this->cartService->getCartItems($userId);
        return response()->json($cartItems);
    }


    public function store($id)
    {
        $user = Auth::guard('customer-api')->user();
        $this->cartService->addToCart($user->id, $id);
        return response()->json(['message' => 'Product added to cart successfully']);
    }


    public function delete($productId)
    {
        $user = Auth::guard('customer-api')->user();
        $this->cartService->removeToCart($user->id, $productId);
        return response()->json(['message' => 'Product removed from cart successfully.'], 200);
    }
}
