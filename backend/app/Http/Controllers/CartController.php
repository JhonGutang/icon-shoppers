<?php

namespace App\Http\Controllers;

use App\Interfaces\Services\CartServiceInterface;
use App\Models\Cart;
use App\Models\CartItem;
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

        $cart = Cart::where('customer_id', $user->id)->first();

        if (!$cart) {
            return response()->json(['message' => 'No active cart found.'], 404);
        }

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Product not found in cart.'], 404);
        }

        $cartItem->delete();

        if ($cart->cartItems()->count() === 0) {
            $cart->delete();
        }

        return response()->json(['message' => 'Product removed from cart successfully.'], 200);
    }
}
