<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use Illuminate\Http\Request;
use App\Http\Requests\AuthRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class ShopController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::guard('shop-api')->user();
        return response()->json(['user' => $user]);
    }

    public function getAllShops () {
        $shops = Shop::all();
        return $shops;
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



    public function login(Request $request)
    {
        $credentials = $request->validate([
            'name' => 'required|string',
            'password' => 'required',
        ]);

        if (!Auth::guard('shop')->attempt($credentials)) {
            return Response::json('Invalid Credentials');
        }

        /** @var \App\Models\Shop $user */
        $user = Auth::guard('shop')->user();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()
            ->json([
                'user' => $user,
                'token' => $token,
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

    /**
     * Show the form for creating a new resource.
     */
    public function create(AuthRequest $request)
    {
        $validatedData = $request->validated();
        $shop = Shop::create([
            'name' => $validatedData['name'],
            'owner' => $validatedData['owner'],
            'email' => $validatedData['email'],
            'contact_number' => $validatedData['contact_number'],
            'password' => bcrypt($validatedData['password']),
        ]);
        return $shop;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Shop $shop)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $shop = Auth::guard('shop-api')->user();

        $validatedData = $request->validate([
            'name'=>'required|string|max:255',
            'email' => 'required|email|unique:shops,email,'.$shop->id,
            'contact_number' => 'required|string|unique:shops,contact_number,' . $shop->id,
            'description'=>'nullable|string',
        ]);

        $shop->update($validatedData);

        return response()->json([
            'message'=>'Edited successfully',
            'shop'=>$shop,
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Shop $shop)
    {
        //
    }
}
