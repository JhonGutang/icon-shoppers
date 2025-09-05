<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Models\Order;
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
        $status = $request->status;

        $orders = $this->orderService->getOrders($status, $shopId);
        return response()->json($orders);
    }
    
    public function statusUpdate(Request $request, $id) {
        $status = $request->status;
        $order = $this->orderService->updateOrderStatus($status, $id);
        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'order' => $order
        ]);
    }

    public function getCustomersOrders(Request $request)
    {
        $userId = Auth::guard('customer-api')->user()->id;
        $status = $request->status;
        $orders = $this->orderService->getCustomerOrders($status, $userId);
        return response()->json($orders);
    }

    public function checkoutOrder(Request $request)
    {
        $customerId = Auth::guard('customer-api')->id();
        $products = $request->products;
        $productIds = collect($request->products)->pluck('id');
        $this->orderService->checkoutOrder($customerId, $products, $productIds);
        return response()->json(['message' => 'Order created and checked out successfully']);
    }
}
