<?php

namespace App\Services;

use App\Interfaces\Repositories\UserRepositoryInterface;
use App\Interfaces\Services\UserServiceInterface;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService implements UserServiceInterface
{
    /**
     * Authenticate a customer with given credentials.
     *
     * @param array $credentials
     * @return mixed
     */
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }


    public function authenticateUser(array $credentials, string $userType)
    {
        try {
            if (!Auth::guard($userType)->attempt($credentials)) {
                return Response::json('Invalid Credentials');
            }
            /** @var \App\Models\Customer $user */
            /** @var \App\Models\Shop $user */
            $user = Auth::guard($userType)->user();
            $token = $user->createToken('auth-token')->plainTextToken;
            return [
                'user' => $user,
                'token' => $token
            ];
        } catch (Exception $e) {
            return Response::json(['error' => 'Authentication failed', 'message' => $e->getMessage()], 500);
        }
    }

    public function registerUser(array $validatedData)
    {
        DB::beginTransaction();
        try {
            $validatedData['password'] = Hash::make($validatedData['password']);
            $registeredUser = $this->userRepository->create($validatedData);
            DB::commit();
            return $registeredUser;
        } catch (Exception $e) {
            DB::rollBack();
            return Response::json(['error' => 'Registration failed', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateUser(array $validatedData, int $id)
    {
        $updatedUser = $this->userRepository->update($validatedData, $id);
        return $updatedUser;
    }
}

