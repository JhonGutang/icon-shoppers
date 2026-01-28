<?php

namespace App\Repositories;

use App\Models\ShopFollower;

class ShopFollowerRepository
{
    protected $model;

    public function __construct(ShopFollower $shopFollower)
    {
        $this->model = $shopFollower;
    }

    public function followShop($userId, $shopId)
    {
        return $this->model->firstOrCreate([
            'user_id' => $userId,
            'shop_id' => $shopId,
        ]);
    }

    public function unfollowShop($userId, $shopId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('shop_id', $shopId)
            ->delete();
    }

    public function isFollowing($userId, $shopId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('shop_id', $shopId)
            ->exists();
    }

    public function getFollowedShops($userId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->with('shop')
            ->get()
            ->pluck('shop');
    }

    public function getFollowerCount($shopId)
    {
        return $this->model
            ->where('shop_id', $shopId)
            ->count();
    }
}
