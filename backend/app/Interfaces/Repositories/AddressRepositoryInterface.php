<?php

namespace App\Interfaces\Repositories;

interface AddressRepositoryInterface
{
    public function getUserAddresses($userId);

    public function getAddressById($id);

    public function createAddress($userId, array $data);

    public function updateAddress($userId, $id, array $data);

    public function deleteAddress($userId, $id);

    public function setDefaultAddress($userId, $id);
}
