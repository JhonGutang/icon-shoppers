<?php

namespace App\Interfaces\Services;

interface AddressServiceInterface
{
    public function getUserAddresses($userId);
    public function createAddress($userId, array $data);
    public function updateAddress($userId, $addressId, array $data);
    public function deleteAddress($userId, $addressId);
    public function setDefaultAddress($userId, $addressId);
}
