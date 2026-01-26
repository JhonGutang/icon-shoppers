<?php

namespace App\Interfaces\Repositories;

interface AddressRepositoryInterface
{
    public function getUserAddresses($userId);
    public function getAddressById($id);
    public function createAddress($userId, array $data);
    public function deleteAddress($id);
    public function setDefaultAddress($userId, $id);
}
