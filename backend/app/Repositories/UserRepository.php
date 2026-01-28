<?php

namespace App\Repositories;

use App\Interfaces\Repositories\UserRepositoryInterface;
use App\Models\User;

class UserRepository implements UserRepositoryInterface
{
    public function getUser(int $userId)
    {
        return User::findOrFail($userId);
    }

    public function findByEmail(string $email)
    {
        return User::where('email', $email)->first();
    }

    public function all()
    {
        return User::all();
    }

    public function create(array $data)
    {
        return User::create($data);
    }

    public function update(array $data, $id)
    {
        $user = User::findOrFail($id);
        $user->update($data);
        return $user->fresh(); // Use fresh to ensure we return updated data
    }
}
