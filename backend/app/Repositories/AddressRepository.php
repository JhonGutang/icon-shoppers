<?php

namespace App\Repositories;

use App\Interfaces\Repositories\AddressRepositoryInterface;
use App\Models\Address;

class AddressRepository implements AddressRepositoryInterface
{
    protected $model;

    public function __construct(Address $address)
    {
        $this->model = $address;
    }

    public function getUserAddresses($userId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getAddressById($id)
    {
        return $this->model->findOrFail($id);
    }

    public function createAddress($userId, array $data)
    {
        $data['user_id'] = $userId;

        // If this is set as default, unset other defaults for this user
        if (isset($data['is_default']) && $data['is_default']) {
            $this->model
                ->where('user_id', $userId)
                ->update(['is_default' => false]);
        }

        return $this->model->create($data);
    }

    public function updateAddress($userId, $id, array $data)
    {
        $address = $this->model->where('user_id', $userId)->findOrFail($id);

        // If this is set as default, unset other defaults for this user
        if (isset($data['is_default']) && $data['is_default']) {
            $this->model
                ->where('user_id', $userId)
                ->where('id', '!=', $id)
                ->update(['is_default' => false]);
        }

        $address->update($data);
        return $address;
    }

    public function deleteAddress($userId, $id)
    {
        return $this->model->where('user_id', $userId)->findOrFail($id)->delete();
    }

    public function setDefaultAddress($userId, $addressId)
    {
        // Unset all defaults for this user
        $this->model
            ->where('user_id', $userId)
            ->update(['is_default' => false]);

        // Set the specified address as default
        return $this->model
            ->where('id', $addressId)
            ->where('user_id', $userId)
            ->update(['is_default' => true]);
    }

    public function getDefaultAddress($userId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('is_default', true)
            ->first();
    }
}
