<?php

namespace App\Http\Controllers;

use App\Http\Requests\ShopCreateRequest;
use App\Http\Requests\ShopDeleteRequest;
use App\Http\Requests\ShopUpdateFormRequest;
use App\Interfaces\Services\ImageServiceInterface;
use App\Interfaces\Services\ShopServiceInterface;
use App\Interfaces\Services\UserServiceInterface;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ShopController extends Controller
{
    protected $userService;

    protected $shopService;

    protected $imageService;

    public function __construct(
        UserServiceInterface $userService,
        ShopServiceInterface $shopService,
        ImageServiceInterface $imageService,
    ) {
        $this->userService = $userService;
        $this->shopService = $shopService;
        $this->imageService = $imageService;
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

        if (! Hash::check($validatedData['password'], $user->password)) {
            return response()->json(['message' => 'Incorrect password confirmation.'], 422);
        }

        $validatedData['owner_id'] = $user->id;

        $shop = $this->shopService->createShop($validatedData);

        if ($request->hasFile('logo_image')) {
            $validatedData['logo_image'] = $this->imageService->uploadImage($request->file('logo_image'), 'logos', $shop->slug);
        }

        if ($request->hasFile('banner_image')) {
            $validatedData['banner_image'] = $this->imageService->uploadImage($request->file('banner_image'), 'banners', $shop->slug);
        }

        if (isset($validatedData['logo_image']) || isset($validatedData['banner_image'])) {
            $this->shopService->updateShop($validatedData, $shop->id);
        }

        $user->update(['role' => User::ROLE_MERCHANT]);

        return response()->json([
            'message' => 'Shop created successfully',
            'shop' => $shop,
        ], 201);
    }

    public function update(ShopUpdateFormRequest $request)
    {
        $user = Auth::user();
        $validatedData = $request->validated();

        $userData = [];
        if (isset($validatedData['user_name'])) {
            $userData['name'] = $validatedData['user_name'];
        }
        if (isset($validatedData['middle_name'])) {
            $userData['middle_name'] = $validatedData['middle_name'];
        }
        if (isset($validatedData['email'])) {
            $userData['email'] = $validatedData['email'];
        }
        if (isset($validatedData['contact_number'])) {
            $userData['contact_number'] = $validatedData['contact_number'];
        }

        if ($request->hasFile('profile_picture')) {
            $userData['profile_picture'] = $request->file('profile_picture')->store('profiles', 'public');
        }

        if (! empty($userData)) {
            $this->userService->updateUser($userData, $user->id);
        }
        $shop = $user->shop;
        if ($shop) {
            $shopData = [];
            if (isset($validatedData['shop_name'])) {
                $shopData['name'] = $validatedData['shop_name'];
            }
            if (isset($validatedData['description'])) {
                $shopData['description'] = $validatedData['description'];
            }
            if (isset($validatedData['shipping_fee'])) {
                $shopData['shipping_fee'] = $validatedData['shipping_fee'];
            }

            if ($request->hasFile('logo_image')) {
                $shopData['logo_image'] = $this->imageService->uploadImage($request->file('logo_image'), 'logos', $shop->slug);
            }

            if ($request->hasFile('banner_image')) {
                $shopData['banner_image'] = $this->imageService->uploadImage($request->file('banner_image'), 'banners', $shop->slug);
            }

            if (! empty($shopData)) {
                $this->shopService->updateShop($shopData, $shop->id);
            }
        }

        $user->load('shop');

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }

    public function getAllShops(Request $request)
    {
        $filters = $request->all();
        $shops = $this->shopService->getAll($filters);

        return response()->json($shops);
    }

    public function getSpecificShop($name)
    {
        $shop = $this->shopService->getShop($name);

        if (! $shop) {
            return response()->json([
                'success' => false,
                'message' => 'Shop not found. The shop may not exist or is inactive.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $shop,
        ], 200);
    }

    public function logout()
    {
        $user = Auth::user();
        $user->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function getAnalytics()
    {
        $user = Auth::user();
        if (! $user->hasShop()) {
            return response()->json(['message' => 'Shop not found.'], 404);
        }

        $analytics = $this->shopService->getAnalytics($user->shop->id);

        return response()->json($analytics);
    }

    public function destroy(ShopDeleteRequest $request)
    {
        $user = Auth::user();

        if (! $user->hasShop()) {
            return response()->json(['message' => 'Shop not found.'], 404);
        }

        $shop = $user->shop;
        $validatedData = $request->validated();

        if (! Hash::check($validatedData['password'], $user->password)) {
            return response()->json(['message' => 'Incorrect password confirmation.'], 422);
        }

        if ($validatedData['shop_name'] !== $shop->name) {
            return response()->json(['message' => 'Shop name confirmation does not match.'], 422);
        }

        if ($shop->logo_image) {
            $this->imageService->deleteImageIfExists($shop->logo_image);
        }
        if ($shop->banner_image) {
            $this->imageService->deleteImageIfExists($shop->banner_image);
        }

        $shop->delete();
        $user->update(['role' => User::ROLE_CUSTOMER]);

        return response()->json([
            'message' => 'Shop deleted successfully',
        ]);
    }
}
