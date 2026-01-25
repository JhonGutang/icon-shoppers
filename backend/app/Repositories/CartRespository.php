<?php

namespace App\Repositories;

use App\DTO\CartGroupDTO;
use App\Interfaces\CartRepositoryInterface;
use App\Models\Cart;
use App\Models\CartItem;

class CartRespository implements CartRepositoryInterface
{

    public function getCartWithItems(int $userId, int $productId)
    {
        return Cart::with(['cartItems' => function($query) use ($productId) {
            $query->where('product_id', $productId);
        }])->where('user_id', $userId)->first();
    }

    public function create(int $userId, int $productId)
    {
        $cart = Cart::where('user_id', $userId)->first();
        if (!$cart) {
            $cart = Cart::create([
                'user_id' => $userId,
            ]);
        }

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->first();

        if ($cartItem) {
            $cartItem->quantity += 1;
            $cartItem->save();
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $productId,
                'quantity' => 1,
            ]);
        }
    }

    public function getItems(int $userId): array
    {
        $cart = Cart::where('user_id', $userId)->first();

        if (!$cart) {
            return [];
        }

        $cartItems = CartItem::where('cart_id', $cart->id)
            ->with([
                'product:id,name,price,shop_id,image',
                'product.shop:id,name,description,logo_image'
            ])
            ->get();

        if ($cartItems->isEmpty()) {
            return [];
        }

        $grouped = $cartItems->groupBy(function ($cartItem) {
            return $cartItem->product->shop->id;
        })->map(function ($items) {
            return CartGroupDTO::fromCartItems($items)->toArray();
        })->values();

        return $grouped->toArray();
    }

    public function removeItems($cartWithItems): void {
        $cartWithItems->cartItems->first()->delete();
        if ($cartWithItems->cartItems()->count() === 0) {
            $cartWithItems->delete();
        }
    }
}
