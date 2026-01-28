<?php

namespace App\Services;

use App\Interfaces\Repositories\UserRepositoryInterface;
use App\Interfaces\Services\ImageServiceInterface;
use App\Interfaces\Services\UserServiceInterface;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;

class UserService implements UserServiceInterface
{
    /**
     * Authenticate a customer with given credentials.
     *
     * @param  array  $credentials
     * @return mixed
     */
    protected $userRepository;

    protected $imageService;

    public function __construct(
        UserRepositoryInterface $userRepository,
        ImageServiceInterface $imageService,
    ) {
        $this->userRepository = $userRepository;
        $this->imageService = $imageService;
    }

    public function authenticateUser(array $credentials)
    {
        try {
            $user = $this->userRepository->findByEmail($credentials['email']);
            if (! Auth::attempt($credentials)) {
                return Response::json('Invalid Credentials', 401);
            }
            /** @var \App\Models\User $user */
            $user = Auth::user();

            if ($user->status === User::STATUS_SUSPENDED) {
                Auth::logout();

                return Response::json('Account is suspended', 403);
            }

            $token = $user->createToken('auth-token')->plainTextToken;

            return [
                'user' => $user,
                'token' => $token,
                'has_shop' => $user->hasShop(),
            ];
        } catch (Exception $e) {

            return Response::json(['error' => 'Authentication failed', 'message' => $e->getMessage()], 500);
        }
    }

    public function registerUser(array $validatedData)
    {
        DB::beginTransaction();
        try {
            $validatedData['role'] = User::ROLE_CUSTOMER;
            $validatedData['password'] = Hash::make($validatedData['password']);

            $registeredUser = $this->userRepository->create($validatedData);

            DB::commit();

            return $registeredUser;
        } catch (Exception $e) {
            DB::rollBack();

            return Response::json(['error' => 'Registration failed', 'message' => $e->getMessage()], 500);
        }
    }

    public function updateUser(array $validatedData, int $userId)
    {
        try {
            DB::beginTransaction();
            $updatedUser = $this->userRepository->update($validatedData, $userId);
            DB::commit();

            return $updatedUser;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
