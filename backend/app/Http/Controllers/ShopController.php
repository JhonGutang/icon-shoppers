<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;
use App\Http\Requests\AuthRequest;
use App\Http\Requests\LoginFormRequest;
use App\Http\Requests\ShopUpdateFormRequest;
use App\Interfaces\Services\UserServiceInterface;
use Illuminate\Support\Facades\Auth;

class ShopController extends Controller
{
    protected $userService;
    public function __construct(UserServiceInterface $userService)
    {
        $this->userService = $userService;
    }


    public function index()
    {
        $user = Auth::guard('shop-api')->user();
        return response()->json(['user' => $user]);
    }

    public function getAllShops(Request $request) {
        $search = $request->query('search');
        $shops = $search ? Shop::where('name', 'like', "%{$search}%")->get() : Shop::all();
        return response()->json($shops);
    }

    

    public function getSpecificShop($name) {
        try {
            $shop = Shop::with('products')->where('name', $name)->firstOrFail();
            return response()->json([
                'success' => true,
                'data' => $shop
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Shop not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching the shop',
                'error' => $e->getMessage()
            ], 500);
        }
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

    public function create(AuthRequest $request)
    {
        $validatedData = $request->validated();
        $this->userService->registerUser($validatedData);
        return response()->json(['message'=> 'Shop created Successfully'], 201);
    }


    public function update(ShopUpdateFormRequest $request)
    {
        /** @var \App\Models\Shop $shop */
        $shop = Auth::guard('shop-api')->user();
        $validatedData = $request->validated();
        $validatedData['logo_file'] = $request->file('logo_image');
        $updatedCustomer = $this->userService->updateUser($validatedData, $shop->id);

        return response()->json([
            'message' => 'Profile updated successfully',
            'shop' => $updatedCustomer,
        ]);
    }
}
