<?php

namespace App\Services;

use App\Interfaces\Repositories\CartRepositoryInterface;
use App\Interfaces\Services\CartServiceInterface;
use Illuminate\Support\Facades\DB;

class CartService implements CartServiceInterface
{
    protected $cartRepository;

    public function __construct(CartRepositoryInterface $cartRepository)
    {
        $this->cartRepository = $cartRepository;
    }

    public function getCartItems(int $userId)
    {
        DB::beginTransaction();
        try {
            $items = $this->cartRepository->getItems($userId);
            DB::commit();

            return $items;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function addToCart(int $userId, int $productId)
    {
        DB::beginTransaction();
        try {
            $this->cartRepository->create($userId, $productId);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function removeToCart(int $userId, int $productId)
    {
        DB::beginTransaction();
        try {
            $cartWithItems = $this->cartRepository->getCartWithItems($userId, $productId);

            if (! $cartWithItems) {
                DB::rollBack();

                return response()->json(['message' => 'No active cart found or product not found in cart.'], 404);
            }
            $this->cartRepository->removeItems($cartWithItems);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
