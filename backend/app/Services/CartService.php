<?php

namespace App\Services;

use App\Interfaces\CartRepositoryInterface;
use App\Interfaces\Services\CartInterface;
use Illuminate\Support\Facades\DB;

class CartService implements CartInterface
{
    protected $cartRepository;
    public function __construct(CartRepositoryInterface $cartRepository)
    {
        $this->cartRepository = $cartRepository;
    }


    /**
     * Add a product to the cart.
     *
     * @param int $userId
     * @param int $productId
     * @param int $quantity
     * @return mixed
     */
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
    
}
