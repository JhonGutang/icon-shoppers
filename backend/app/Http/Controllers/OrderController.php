<?php

namespace App\Http\Controllers;
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
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasShop()) {
            return response()->json(['message' => 'Unauthorized. Must have a shop to view seller orders.'], 403);
        }

        $shopId = $user->shop->id;
        $status = $request->status;

        $orders = $this->orderService->getOrders($status, $shopId);
        return response()->json($orders);
    }
    
    public function statusUpdate(Request $request, $id) {
        $status = $request->status;
        // In the new flow, we should ensure the user owns the shop the order belongs to
        $order = $this->orderService->updateOrderStatus($status, $id);
        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'order' => $order
        ]);
    }

    public function getCustomersOrders(Request $request)
    {
        $userId = Auth::id();
        $status = $request->status;
        $orders = $this->orderService->getCustomerOrders($status, $userId);
        return response()->json($orders);
    }

    public function checkoutOrder(Request $request)
    {
        $customerId = Auth::id();
        $products = $request->products;
        $productIds = collect($products)->pluck('id');
        
        $data = $request->only(['shipping_address', 'notes', 'payment_method']);
        
        // This will need to handle the new grouping logic or multiple orders per shop
        $result = $this->orderService->checkoutOrder($customerId, $products, $productIds, $data);
        
        return response()->json([
            'message' => 'Order placed successfully',
            'result' => $result
        ]);
    }
}
