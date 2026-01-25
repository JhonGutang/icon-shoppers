<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Http\Requests\LoginFormRequest;
use App\Http\Requests\UpdateFormRequest;
use App\Interfaces\Services\UserServiceInterface;
use App\Models\User;
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
        $user = Auth::user();
        return $user;
    }

    public function login(LoginFormRequest $request) {
        $credentials = $request->validated();
        $authenticatedUser = $this->userService->authenticateUser($credentials);
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
        $validatedData['role'] = User::ROLE_CUSTOMER;
        $registeredUser = $this->userService->registerUser($validatedData);
        return response()->json([
            'message'  => 'Customer created successfully.',
            'customer' => $registeredUser,
        ], 201);
    }

    public function update(UpdateFormRequest $request)
    {
        $user = Auth::user();
        $validatedData = $request->validated();
        $updatedCustomer = $this->userService->updateUser($validatedData, $user->id);
        return response()->json([
            'message' => 'Customer updated successfully.',
            'customer' => $updatedCustomer,
        ]);
    }

    public function logout () {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->tokens()->delete();
        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
