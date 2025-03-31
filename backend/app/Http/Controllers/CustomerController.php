<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::guard('customer-api')->user();
        return response()->json(['user' => $user]);
    }


    public function login(Request $request) {
        $credentials = $request->validate([
            'name' => 'required|string',
            'password' => 'required',
        ]);

        if (!Auth::guard('customer')->attempt($credentials)) {
            return Response::json('Invalid Credentials');
        }

        /** @var \App\Models\Customer $user */

        $user = Auth::guard('customer')->user();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()
            ->json([
                'user' => $user,
                'token' => $token,
                'type' => 'seller'
            ])
        ;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(CustomerRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['password'] = Hash::make($validatedData['password']);

        $customer = Customer::create($validatedData);
        return response()->json([
            'message'  => 'Customer created successfully.',
            'customer' => $customer,
        ], 201);
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
    public function show(Customer $customer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        //
    }
}
