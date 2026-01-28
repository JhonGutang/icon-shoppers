<?php

namespace App\Http\Controllers;

use App\Interfaces\Services\AddressServiceInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    protected $addressService;

    public function __construct(AddressServiceInterface $addressService)
    {
        $this->addressService = $addressService;
    }

    public function index()
    {
        $userId = Auth::id();
        $addresses = $this->addressService->getUserAddresses($userId);

        return response()->json($addresses);
    }

    public function store(Request $request)
    {
        $userId = Auth::id();
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'street' => 'required|string|max:255',
            'barangay' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'postal_code' => 'required|string|max:20',
            'is_default' => 'boolean',
        ]);

        $address = $this->addressService->createAddress($userId, $validatedData);

        return response()->json($address, 201);
    }

    public function update(Request $request, $id)
    {
        $userId = Auth::id();
        $validatedData = $request->validate([
            'name' => 'string|max:255',
            'phone' => 'string|max:20',
            'street' => 'string|max:255',
            'barangay' => 'string|max:255',
            'city' => 'string|max:255',
            'postal_code' => 'string|max:20',
            'is_default' => 'boolean',
        ]);

        $address = $this->addressService->updateAddress($userId, $id, $validatedData);

        return response()->json($address);
    }

    public function destroy($id)
    {
        $userId = Auth::id();
        $this->addressService->deleteAddress($userId, $id);

        return response()->json(['message' => 'Address deleted successfully']);
    }

    public function setDefault($id)
    {
        $userId = Auth::id();
        $address = $this->addressService->setDefaultAddress($userId, $id);

        return response()->json($address);
    }
}
