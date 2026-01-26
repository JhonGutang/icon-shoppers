<?php

namespace App\Services;

use App\Interfaces\Repositories\ShopRepositoryInterface;
use App\Interfaces\Services\ShopServiceInterface;
use Illuminate\Support\Facades\DB;

class ShopService implements ShopServiceInterface
{
    protected $shopRepository;

    public function __construct(
        ShopRepositoryInterface $shopRepository,
    ) {
        $this->shopRepository = $shopRepository;
    }

    public function getAll($searchParam)
    {
        try {
            DB::beginTransaction();
            $shops = $this->shopRepository->getAllShops($searchParam);
            DB::commit();
            return $shops;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getShop($shopName) {
        try {
            DB::beginTransaction();
            $shop = $this->shopRepository->getSpecificShop($shopName);
            DB::commit();
            return $shop;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function createShop(array $data)
    {
        try {
            DB::beginTransaction();
            $shop = $this->shopRepository->create($data);
            DB::commit();
            return $shop;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
