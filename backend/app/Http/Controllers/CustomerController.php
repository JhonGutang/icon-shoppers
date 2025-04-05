<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::guard('customer-api')->user();
        return $user;
    }

    public function login(Request $request) {
        $credentials = $request->validate([
            'name' => 'required|string',
            'password' => 'required',
        ]);

        if (!Auth::guard('customer')->attempt($credentials)) {
            return Response::json('Invalid Credentials');
        }

        /** @var \App\Models\Customer $user */

        $user = Auth::guard('customer')->user();
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()
            ->json([
                'user' => $user,
                'token' => $token,
                'type' => 'seller'
            ])
        ;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(CustomerRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['password'] = Hash::make($validatedData['password']);

        $customer = Customer::create($validatedData);
        return response()->json([
            'message'  => 'Customer created successfully.',
            'customer' => $customer,
        ], 201);
    }

    public function update(Request $request)
    {
        $user = Auth::guard('customer-api')->user(); 
        $customer = Customer::findOrFail($user->id);

        $validatedData = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'contactNumber' => 'required|string',
            'address' => 'nullable|string',
            'middleName' => 'nullable|string',
        ]);

        $customer->name = $validatedData['name'];
        $customer->email = $validatedData['email'];
        $customer->contact_number = $validatedData['contactNumber'];
        $customer->address = $validatedData['address'];
        $customer->middle_name = $validatedData['middleName'];
        $customer->save();

        return response()->json([
            'message' => 'Customer updated successfully.',
            'customer' => $customer,
        ]);
    }

    public function addToCart($id)
    {
        $user = Auth::guard('customer-api')->user();
        $product = Product::findOrFail($id);

        $existingOrder = Order::where('customer_id', $user->id)
            ->where('product_id', $id)
            ->where('status', '')
            ->first();

        if ($existingOrder) {
            $existingOrder->quantity += 1;
            $existingOrder->total_amount = $existingOrder->quantity * $product->price;
            $existingOrder->save();
        } else {
            Order::create([
                'customer_id' => $user->id,
                'product_id' => $id,
                'quantity' => 1,
                'total_amount' => $product->price,
                'status' => 'ordered',
            ]);
        }

        return response()->json(['message' => 'Product added to cart successfully']);
    }

    public function removeToCart($id)
    {
        $order = Order::where('product_id',$id);
        if ($order) {
            $order->delete();
            return response()->json(['message' => 'Order removed from cart successfully.'], 200);
        } else {
            return response()->json(['message' => 'Order not found.'], 404);
        }
    }

    public function checkoutOrder(Request $request)
    {
        $customerId = Auth::guard('customer-api')->id();

        foreach ($request->products as $productItem) {
            $order = Order::find($productItem['order_id']);

            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }

            if ($order->customer_id !== $customerId) {
                return response()->json(['message' => 'Unauthorized access to this order'], 403);
            }

            $product = Product::find($productItem['id']);
            if (!$product) {
                return response()->json(['message' => 'Product not found'], 404);
            }

            $totalAmount = $product->price * $productItem['quantity'];

            $order->product_id   = $productItem['id'];
            $order->quantity     = $productItem['quantity'];
            $order->total_amount = $totalAmount;
            $order->status       = 'ordered';
            $order->updated_at   = now();

            $order->save();
        }

        return response()->json(['message' => 'Order updated and checked out successfully']);
    }

    public function fetchAllPendings()
    {
        $userId = Auth::guard('customer-api')->user()->id;
        $pendings = Order::where('status', 'ordered')
            ->where('customer_id', $userId)
            ->with(['product:id,name,price'])
            ->get()
            ->map(function ($order) {
                return [
                    'order_id' => $order->id,
                    'status' => $order->status,
                    'name' => $order->product->name ?? null,
                    'price' => $order->product->price ?? null,
                    'quantity' => $order->quantity,
                    'id' => $order->product->id,
                ];
            });

        return response()->json($pendings);
    }

    public function fetchPendingProductForCheckout()
    {
        $userId = Auth::guard('customer-api')->user()->id;

        $pendings = Order::where('status', 'ordered')
            ->where('customer_id', $userId)
            ->with([
                'product:id,name,price,shop_id,image',
                'product.shop:id,name,email,description,contact_number'
            ])
            ->get();

        $grouped = $pendings->groupBy(function ($order) {
            return $order->product->shop->id;
        })->map(function ($orders) {
            $shop = $orders->first()->product->shop;
            $products = $orders->map(function ($order) {
                return [
                    'id' => $order->product->id,
                    'order_id' => $order->id,
                    'name' => $order->product->name,
                    'price' => $order->product->price,
                    'image' => $order->product->image,
                    'quantity' => $order->quantity,
                ];
            });

            return [
                'shop' => [
                    'id' => $shop->id,
                    'name' => $shop->name,
                    'email' => $shop->email,
                    'description' => $shop->description,
                    'contact_number' => $shop->contact_number,
                ],
                'products' => $products->values(),
            ];
        })->values();

        return response()->json($grouped);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Customer $customer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        //
    }
}
