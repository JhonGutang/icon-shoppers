<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;
use App\Http\Requests\AuthRequest;
use App\Http\Requests\LoginFormRequest;
use App\Http\Requests\ShopUpdateFormRequest;
use App\Interfaces\Services\ShopServiceInterface;
use App\Interfaces\Services\UserServiceInterface;
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
        $user = Auth::guard('shop-api')->user();
        return response()->json(['user' => $user]);
    }

    
    public function create(AuthRequest $request)
    {
        $validatedData = $request->validated();
        $this->userService->registerUser($validatedData);
        return response()->json(['message'=> 'Shop created Successfully'], 201);
    }


    public function update(ShopUpdateFormRequest $request)
    {
        $shop = Auth::guard('shop-api')->user();
        $validatedData = $request->validated();
        $validatedData['logo_file'] = $request->file('logo_image');
        $updatedCustomer = $this->userService->updateUser($validatedData, $shop->id);

        return response()->json([
            'message' => 'Profile updated successfully',
            'shop' => $updatedCustomer,
        ]);
    }

    public function getAllShops(Request $request) {
        $searchParams = $request->query('search');
        $shops = $this->shopService->getAll($searchParams);
        return response()->json($shops);
    }

    public function getSpecificShop($name) {
  
            $shop = $this->shopService->getShop($name);
            return response()->json([
                'success' => true,
                'data' => $shop
            ], 200);
    }

    public function login(LoginFormRequest $request)
    {
        $credentials = $request->validated();
        $authenticatedUser = $this->userService->authenticateUser($credentials, 'shop');
        return response()
            ->json([
                'user' => $authenticatedUser['user'],
                'token' => $authenticatedUser['token'],
                'type' => 'shop'
            ])
        ;
    }

    public function logout () {
        /** @var \App\Models\Shop $user */
        $user = Auth::guard('shop-api')->user();
        $user->tokens()->delete();
        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

}
