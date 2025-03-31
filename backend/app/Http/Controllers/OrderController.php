<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Http\Requests\OrderRequest;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function index(Request $request){
        $orders = Order::with(['customer', 'product'])->get();

        if($request->has('status')){
            $orders->where('status', $request->status);
        }
        return response()->json($orders);
    }
    public function show($id){
        $order = Order::find($id);

        if(!$order){
            return response()->json(['message'=>'Order not found'], 404);
        }
        return response()->json($order);
    }

    public function update(OrderRequest $request, $id){
        $order = Order::find($id);

        if(!$order){
            return response()->json(['message'=>'Order not found.'], 404);
        }

        $order->update($request->validated());
        return response()->json($order);
    }

    public function delete($id){
        $order = Order::find($id);

        if(!$order){
            return response()->json(['message'=>'Order not found.'], 404);
        }
        $order->delete();
        return response()->json([
            'message'=>'Order deleted.'
        ]);
    }

    public function getSellerOrders(Request $request)
    {

        $shopId = auth('shop-api')->id();

        $orders = Order::whereHas('product', function($query) use ($shopId) {
            $query->where('shop_id', $shopId);
        })
        ->with(['product:id,name,price,image', 'customer:id,name,contact_number,address'])
        ->when($request->has('status'), function($query) use ($request) {
            return $query->where('status', $request->status);
        })
        ->orderBy('created_at', 'desc')
        ->get();

        $groupedOrders = $orders->groupBy('status');

        return response()->json([
            'orders' => $groupedOrders,
            'total_orders' => $orders->count(),
            'pending_orders' => $orders->where('status', 'ordered')->count(),
            'completed_orders' => $orders->where('status', 'completed')->count(),
        ]);
    }

    public function getCustomersOrders()
    {
        $userId = Auth::guard('customer-api')->user()->id;
    
        $orders = Order::where('status', 'approved')
            ->where('customer_id', $userId)
            ->with([
                'product:id,name,price,shop_id,image',
                'product.shop:id,name,email,description,contact_number'
            ])
            ->get();
    
        $grouped = $orders->groupBy(function ($order) {
            return $order->product->shop->id;
        })->map(function ($orders) {
            $shop = $orders->first()->product->shop;
            $status = $orders->first()->status; 
    
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
    
            // Ensure the total amount is formatted to 2 decimal places
            $totalAmount = number_format(
                $orders->sum(function ($order) {
                    return $order->product->price * $order->quantity;
                }), 
                2, '.', ''
            );
    
            return [
                'shop' => [
                    'id' => $shop->id,
                    'name' => $shop->name,
                    'email' => $shop->email,
                    'description' => $shop->description,
                    'contact_number' => $shop->contact_number,
                ],
                'products' => $products->values(),
                'status' => $status, 
                'total_amount' => $totalAmount, 
            ];
        })->values();
    
        return response()->json($grouped);
    }
    

    public function addToCart($id)
    {
        $user = Auth::guard('customer-api')->user();
        $product = Product::findOrFail($id);

        $existingOrder = Order::where('customer_id', $user->id)
            ->where('product_id', $id)
            ->where('status', 'cart')
            ->first();


        if ($existingOrder) {
            $existingOrder->quantity += 1;
            $existingOrder->total_amount = $existingOrder->quantity * $product->price;
            $existingOrder->save();
        } else {
            Order::create([
                'customer_id' => $user->id,
                'product_id' => $id,
                'shop_id' => $product->shop_id,
                'quantity' => 1,
                'total_amount' => $product->price,
                'status' => 'cart',
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
        $pendings = Order::where('status', 'cart')
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

        $pendings = Order::where('status', 'cart')
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

}
