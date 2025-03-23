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
    public function update(Request $request, Shop $shop)
    {
        $validatedData = $request->validate([
            'name'=>'required|string|maxx:255',
            'contact_number'=>'required|string|unique:shops,contact_number'.$shop->$id,
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
