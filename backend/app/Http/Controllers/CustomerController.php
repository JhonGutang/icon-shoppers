<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Http\Requests\LoginFormRequest;
use App\Http\Requests\UpdateFormRequest;
use App\Interfaces\Services\UserServiceInterface;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $userService;

    public function __construct(UserServiceInterface $userService)
    {
        $this->userService = $userService;
    }

    public function index()
    {
        $user = Auth::guard('customer-api')->user();
        return $user;
    }

    public function login(LoginFormRequest $request) {
        $credentials = $request->validated();
        $authenticatedUser = $this->userService->authenticateUser($credentials, 'customer');
        return response()
            ->json([
                'user' => $authenticatedUser['user'],
                'token' => $authenticatedUser['token'],
                'type' => 'customer'
            ])
        ;
    }

    public function create(CustomerRequest $request)
    {
        $validatedData = $request->validated();
        $registeredUser = $this->userService->registerUser($validatedData);
        return response()->json([
            'message'  => 'Customer created successfully.',
            'customer' => $registeredUser,
        ], 201);
    }

    public function update(UpdateFormRequest $request)
    {
        $user = Auth::guard('customer-api')->user();
        $validatedData = $request->validated();
        $updatedCustomer = $this->userService->updateUser($validatedData, $user->id);
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
