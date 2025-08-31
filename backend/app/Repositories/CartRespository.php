<?php

namespace App\Repositories;

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
}
