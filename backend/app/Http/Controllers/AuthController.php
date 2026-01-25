<?php

namespace App\Http\Controllers;

use App\Interfaces\Services\UserServiceInterface;
use App\Models\User;
use App\Http\Requests\LoginFormRequest;
use App\Http\Requests\CustomerRequest;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    protected $userService;

    public function __construct(UserServiceInterface $userService)
    {
        $this->userService = $userService;
    }

    public function login(LoginFormRequest $request) {
        $credentials = $request->validated();
        $result = $this->userService->authenticateUser($credentials);
        
        if ($result instanceof \Illuminate\Http\JsonResponse) {
            return $result;
        }

        return response()->json([
            'user' => $result['user'],
            'token' => $result['token'],
            'role' => $result['user']->role
        ]);
    }

    public function register(CustomerRequest $request)
    {
        $validatedData = $request->validated();
        // Default to customer role if not specified or restricted by policy
        $validatedData['role'] = $validatedData['role'] ?? User::ROLE_CUSTOMER;
        
        $registeredUser = $this->userService->registerUser($validatedData);
        
        if ($registeredUser instanceof \Illuminate\Http\JsonResponse) {
            return $registeredUser;
        }

        return response()->json([
            'message'  => 'User created successfully.',
            'user' => $registeredUser,
        ], 201);
    }

    public function logout(Request $request) {
        $request->user()->tokens()->delete();
        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
