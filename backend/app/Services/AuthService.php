<?php

namespace App\Services;

use App\Interfaces\Services\AuthInterface;
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
}
