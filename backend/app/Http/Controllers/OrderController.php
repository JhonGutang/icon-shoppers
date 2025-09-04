<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Http\Requests\OrderRequest;
use App\Interfaces\Services\OrderServiceInterface;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    protected $orderService;
    public function __construct(OrderServiceInterface $orderService)
    {
        $this->orderService = $orderService;
    }

    public function show($id){
        $order = Order::find($id);

        if(!$order){
            return response()->json(['message'=>'Order not found'], 404);
        }
        return response()->json($order);
    }


    public function getOrders(Request $request)
    {

        if (!Auth::guard('shop-api')->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $shopId = Auth::guard('shop-api')->id();

        $query = Order::with([
            'customer',
            'orderItems.product',
            'orderItems.product.shop'
        ])
        ->whereHas('orderItems.product', function($query) use ($shopId) {
            $query->where('shop_id', $shopId);
        });

        // Add status filter if provided
        if ($request->has('status') && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        $orders = $query->get();


        // Format the data in a way the frontend expects
        $formattedOrders = $orders->map(function($order) {
            return [
                'id' => $order->id,
                'customerName' => $order->customer->name,
                'products' => $order->orderItems->map(function($item) {
                    return [
                        'name' => $item->product->name,
                        'quantity' => $item->quantity,
                        'totalPrice' => $item->quantity * $item->product->price,
                    ];
                }),
                'totalAmount' => $order->total_amount,
                'status' => $order->status,
                'shippingAddress' => $order->shipping_address,
            ];
        });

        return response()->json($formattedOrders);
    }


    public function approve($id)
    {
        try {
            $order = Order::findOrFail($id);

            $order->update([
                'status' => 'to_be_delivered'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Order approved successfully',
                'order' => $order
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve order'
            ], 500);
        }
    }

    public function reject($id)
    {
        \Log::info('Attempting to reject order: ' . $id);

        try {
            $order = Order::findOrFail($id);

            $order->update([
                'status' => 'rejected'
            ]);

            \Log::info('Order rejected successfully:', ['id' => $order->id, 'new_status' => $order->status]);

            return response()->json([
                'success' => true,
                'message' => 'Order rejected.',
                'order' => $order
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            \Log::warning('Order not found: ' . $id);
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        } catch (\Exception $e) {
            \Log::error('Error rejecting order:', [
                'order_id' => $id,
                'error' => $e->getMessage()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject order'
            ], 500);
        }
    }

    public function statusUpdate(Request $request, $id) {
        try {
            $order = Order::findOrFail($id);
            
            $order->update([
                'status' => $request->status
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'order' => $order
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status'
            ], 500);
        }
    }



    public function getCustomersOrders(Request $request)
    {
        $userId = Auth::guard('customer-api')->user()->id;
        
        $query = Order::where('customer_id', $userId)
            ->where('status', '!=', 'cart')
            ->with([
                'orderItems.product:id,name,price,shop_id,image',
                'orderItems.product.shop:id,name,email,description,contact_number'
            ]);

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $orders = $query->get();

        if ($orders->isEmpty()) {
            return response()->json([]);
        }

        $grouped = $orders->map(function ($order) {
            $shopOrders = $order->orderItems->groupBy(function ($item) {
                return $item->product->shop->id;
            });

            return $shopOrders->map(function ($items, $shopId) use ($order) {
                $shop = $items->first()->product->shop;

                $products = $items->map(function ($item) {
                    return [
                        'id' => $item->product->id,
                        'order_item_id' => $item->id,
                        'name' => $item->product->name,
                        'price' => $item->product->price,
                        'image' => $item->product->image,
                        'quantity' => $item->quantity,
                    ];
                });

                return [
                    'order_id' => $order->id,
                    'shop' => [
                        'id' => $shop->id,
                        'name' => $shop->name,
                        'email' => $shop->email,
                        'description' => $shop->description,
                        'contact_number' => $shop->contact_number,
                    ],
                    'products' => $products->values(),
                    'status' => $order->status,
                    'total_amount' => number_format($order->total_amount, 2, '.', ''),
                ];
            })->values();
        })->flatten(1);

        return response()->json($grouped);
    }

    public function checkoutOrder(Request $request)
    {
        $customerId = Auth::guard('customer-api')->id();

        $order = Order::create([
            'customer_id' => $customerId,
            'status' => 'ordered',
            'total_amount' => 0,
        ]);

        $totalAmount = 0;

        $productIds = collect($request->products)->pluck('id');
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        foreach ($request->products as $productItem) {
            $product = $products->get($productItem['id']);
            if (!$product) {
                return response()->json(['message' => 'Product not found'], 404);
            }

            $orderItem = new OrderItem([
                'order_id' => $order->id,
                'product_id' => $productItem['id'],
                'quantity' => $productItem['quantity'],
                'price' => $product->price * $productItem['quantity'],
                'total' => $product->price * $productItem['quantity'],
            ]);
            $orderItem->save();

            $totalAmount += $orderItem->total;
        }

        $order->update(['total_amount' => $totalAmount]);

        return response()->json(['message' => 'Order created and checked out successfully']);
    }

    public function receive($id)
    {
        try {
            $order = Order::findOrFail($id);

            if ($order->customer_id !== Auth::guard('customer-api')->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized to update this order'
                ], 403);
            }

            $order->update([
                'status' => 'recieved'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Order marked as received',
                'order' => $order
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status'
            ], 500);
        }
    }

}
