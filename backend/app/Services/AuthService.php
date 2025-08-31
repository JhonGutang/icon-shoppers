<?php

namespace App\Services;

use App\Interfaces\Services\AuthInterface;
use App\Models\Customer;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Auth;
use Exception;

class AuthService implements AuthInterface
{
    /**
     * Authenticate a customer with given credentials.
     *
     * @param array $credentials
     * @return mixed
     */
    public function authenticateCustomer(array $credentials)
    {
        try {
            if (!Auth::guard('customer')->attempt($credentials)) {
                return Response::json('Invalid Credentials');
            }
            /** @var \App\Models\Customer $user */
            $user = Auth::guard('customer')->user();
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
            $registeredUser = $this->customerRepository->create($validatedData);
            DB::commit();
            return $registeredUser;
        } catch (Exception $e) {
            DB::rollBack();
            return Response::json(['error' => 'Registration failed', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateUser(array $validatedData, int $id)
    {
        $updatedUser = $this->customerRepository->update($validatedData, $id);
        return $updatedUser;
    }
}

