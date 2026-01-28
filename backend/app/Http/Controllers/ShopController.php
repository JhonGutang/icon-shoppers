<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;
use App\Http\Requests\ShopUpdateFormRequest;
use App\Http\Requests\ShopCreateRequest;
use App\Interfaces\Services\ShopServiceInterface;
use App\Interfaces\Services\UserServiceInterface;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ShopController extends Controller
{
    protected $userService;
    protected $shopService;

    public function __construct(
        UserServiceInterface $userService,
        ShopServiceInterface $shopService,
    )
    {
        $this->userService = $userService;
        $this->shopService = $shopService;
    }


    public function index()
    {
        $user = Auth::user();
        $user->load('shop');
        return response()->json(['user' => $user]);
    }

    
    public function create(ShopCreateRequest $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        if ($user->hasShop()) {
            return response()->json(['message' => 'User already has a shop.'], 400);
        }

        $validatedData = $request->validated();
        $validatedData['owner_id'] = $user->id;
        $validatedData['status'] = Shop::STATUS_ACTIVE;

        if ($request->hasFile('logo_image')) {
            $validatedData['logo_image'] = $request->file('logo_image')->store('shops/logos', 'public');
        }

        if ($request->hasFile('banner_image')) {
            $validatedData['banner_image'] = $request->file('banner_image')->store('shops/banners', 'public');
        }

        $shop = $this->shopService->createShop($validatedData);

        // Transition user to merchant role
        $user->update(['role' => User::ROLE_MERCHANT]);

        return response()->json([
            'message' => 'Shop created successfully',
            'shop' => $shop
        ], 201);
    }

    public function update(ShopUpdateFormRequest $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $validatedData = $request->validated();

        // 1. Handle User Update
        $userData = [];
        if (isset($validatedData['user_name'])) $userData['name'] = $validatedData['user_name'];
        if (isset($validatedData['middle_name'])) $userData['middle_name'] = $validatedData['middle_name'];
        if (isset($validatedData['email'])) $userData['email'] = $validatedData['email'];
        if (isset($validatedData['contact_number'])) $userData['contact_number'] = $validatedData['contact_number'];
        
        if ($request->hasFile('profile_picture')) {
            $userData['profile_picture'] = $request->file('profile_picture')->store('profiles', 'public');
        }

        if (!empty($userData)) {
            $this->userService->updateUser($userData, $user->id);
        }

        // 2. Handle Shop Update (if user is a merchant)
        $shop = $user->shop;
        if ($shop) {
            $shopData = [];
            if (isset($validatedData['shop_name'])) $shopData['name'] = $validatedData['shop_name'];
            if (isset($validatedData['description'])) $shopData['description'] = $validatedData['description'];
            if (isset($validatedData['shipping_fee'])) $shopData['shipping_fee'] = $validatedData['shipping_fee'];

            if ($request->hasFile('logo_image')) {
                $shopData['logo_image'] = $request->file('logo_image')->store('shops/logos', 'public');
            }

            if ($request->hasFile('banner_image')) {
                $shopData['banner_image'] = $request->file('banner_image')->store('shops/banners', 'public');
            }

            if (!empty($shopData)) {
                $this->shopService->updateShop($shopData, $shop->id);
            }
        }

        $user->load('shop');

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    public function getAllShops(Request $request) {
        $searchParams = $request->query('search');
        $shops = $this->shopService->getAll($searchParams);
        return response()->json($shops);
    }

    public function getSpecificShop($name) {
        $shop = $this->shopService->getShop($name);
        
        if (!$shop) {
            return response()->json([
                'success' => false,
                'message' => 'Shop not found. The shop may not exist or is inactive.'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $shop
        ], 200);
    }


    public function logout () {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->tokens()->delete();
        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    public function getAnalytics()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasShop()) {
            return response()->json(['message' => 'Shop not found.'], 404);
        }

        $analytics = $this->shopService->getAnalytics($user->shop->id);
        return response()->json($analytics);
    }

}
