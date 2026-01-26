<?php

namespace App\Services;

use App\Interfaces\Services\AddressServiceInterface;
use App\Interfaces\Repositories\AddressRepositoryInterface;

class AddressService implements AddressServiceInterface
{
    protected $addressRepository;

    public function __construct(AddressRepositoryInterface $addressRepository)
    {
        $this->addressRepository = $addressRepository;
    }

    public function getUserAddresses($userId)
    {
        return $this->addressRepository->getUserAddresses($userId);
    }

    public function createAddress($userId, array $data)
    {
        return $this->addressRepository->createAddress($userId, $data);
    }

    public function updateAddress($userId, $addressId, array $data)
    {
        return $this->addressRepository->updateAddress($userId, $addressId, $data);
    }

    public function deleteAddress($userId, $addressId)
    {
        return $this->addressRepository->deleteAddress($userId, $addressId);
    }

    public function setDefaultAddress($userId, $addressId)
    {
        return $this->addressRepository->setDefaultAddress($userId, $addressId);
    }
}
