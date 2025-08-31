<?php

namespace App\Http\Controllers;

use App\Interfaces\Services\CartInterface;
use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{   
    protected $cartService;
    public function __construct(CartInterface $cartService)
    {
        $this->cartService = $cartService;
    }


    public function index() {
        $userId = Auth::guard('customer-api')->user()->id;


        $cart = Cart::where('customer_id', $userId)->first();
    
        if (!$cart) {
            return response()->json([]); 
        }
    

        $cartItems = CartItem::where('cart_id', $cart->id)
            ->with([
                'product:id,name,price,shop_id,image',
                'product.shop:id,name,email,description,contact_number,logo_image'
            ])
            ->get();
    
        if ($cartItems->isEmpty()) {
            return response()->json([]);
        }

        $grouped = $cartItems->groupBy(function ($cartItem) {
            return $cartItem->product->shop->id;
        })->map(function ($items) {
            $shop = $items->first()->product->shop;
            $products = $items->map(function ($item) {
                return [
                    'id' => $item->product->id,
                    'cart_item_id' => $item->id,
                    'name' => $item->product->name,
                    'price' => $item->product->price,
                    'image' => $item->product->image,
                    'quantity' => $item->quantity,
                ];
            });
    
            return [
                'shop' => [
                    'id' => $shop->id,
                    'name' => $shop->name,
                    'email' => $shop->email,
                    'logo_image' => $shop->logo_image,
                    'description' => $shop->description,
                    'contact_number' => $shop->contact_number,
                ],
                'products' => $products->values(),
            ];
        })->values();
    
        return response()->json($grouped);
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
