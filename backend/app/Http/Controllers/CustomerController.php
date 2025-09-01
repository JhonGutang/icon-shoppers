<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Http\Requests\LoginFormRequest;
use App\Http\Requests\UpdateFormRequest;
use App\Interfaces\Services\AuthInterface;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $authService;

    public function __construct(AuthInterface $authService)
    {
        $this->authService = $authService;
    }

    public function index()
    {
        $user = Auth::guard('customer-api')->user();
        return $user;
    }

    public function login(LoginFormRequest $request) {
        $credentials = $request->validated();
        $authenticatedUser = $this->authService->authenticateUser($credentials);
        return response()
            ->json([
                'user' => $authenticatedUser['user'],
                'token' => $authenticatedUser['token'],
                'type' => 'seller'
            ])
        ;
    }

    public function create(CustomerRequest $request)
    {
        $validatedData = $request->validated();
        $registeredUser = $this->authService->registerUser($validatedData);
        return response()->json([
            'message'  => 'Customer created successfully.',
            'customer' => $registeredUser,
        ], 201);
    }

    public function update(UpdateFormRequest $request)
    {
        $user = Auth::guard('customer-api')->user();
        $validatedData = $request->validated();
        $updatedCustomer = $this->authService->updateUser($validatedData, $user->id);
        return response()->json([
            'message' => 'Customer updated successfully.',
            'customer' => $updatedCustomer,
        ]);
    }

    public function logout () {
        /** @var \App\Models\Customer $user */
        $user = Auth::guard('customer-api')->user();
        $user->tokens()->delete();
        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
