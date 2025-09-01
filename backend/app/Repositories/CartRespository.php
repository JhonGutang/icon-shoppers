<?php

namespace App\Repositories;

use App\DTO\CartGroupDTO;
use App\Interfaces\CartRepositoryInterface;
use App\Models\Cart;
use App\Models\CartItem;

class CartRespository implements CartRepositoryInterface
{
    public function create(int $userId, int $productId)
    {
        $cart = Cart::where('customer_id', $userId)->first();
        if (!$cart) {
            $cart = Cart::create([
                'customer_id' => $userId,
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
        $cart = Cart::where('customer_id', $userId)->first();

        if (!$cart) {
            return [];
        }

        $cartItems = CartItem::where('cart_id', $cart->id)
            ->with([
                'product:id,name,price,shop_id,image',
                'product.shop:id,name,email,description,contact_number,logo_image'
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
}
