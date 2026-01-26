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

    /**
     * Get details of a specific order by order number
     */
    public function show($orderNumber)
    {
        try {
            $order = $this->orderService->getOrderDetails($orderNumber);
            return response()->json($order);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // fallback to ID search for old routes
            if (is_numeric($orderNumber)) {
                $order = Order::with(['user', 'shop', 'orderItems.product.shop'])->find($orderNumber);
                if ($order) return response()->json($order);
            }
            return response()->json(['message' => 'Order not found'], 404);
        }
    }

    /**
     * Get orders for the seller's shop
     */
    public function getOrders(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasShop()) {
            return response()->json(['message' => 'Unauthorized. Must have a shop to view seller orders.'], 403);
        }

        $shopId = $user->shop->id;
        $status = $request->query('status', 'ALL');
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 20);

        $orders = $this->orderService->getOrders($status, $shopId, $page, $perPage);
        return response()->json($orders);
    }
    
    /**
     * Update order status (Seller action)
     */
    public function statusUpdate(Request $request, $id)
    {
        $status = $request->input('status');
        
        // Ensure status sequence is followed (Planned for future, but basic update for now)
        $order = $this->orderService->updateOrderStatus($status, $id);
        
        return response()->json([
            'success' => true,
            'message' => 'Order status updated to ' . str_replace('_', ' ', $status),
            'order' => $order
        ]);
    }

    /**
     * Get orders for the logged-in customer
     */
    public function getCustomersOrders(Request $request)
    {
        $userId = Auth::id();
        $status = $request->query('status', 'ALL');
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 20);

        $orders = $this->orderService->getCustomerOrders($status, $userId, $page, $perPage);
        return response()->json($orders);
    }

    /**
     * Place order(s) (Customer action)
     */
    public function checkoutOrder(Request $request)
    {
        $request->validate([
            'products' => 'required|array',
            'products.*.id' => 'required|integer|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
            'payment_method' => 'required|string',
        ]);

        $userId = Auth::id();
        $products = $request->input('products');
        $productIds = collect($products)->pluck('id');
        
        $data = $request->only(['shipping_address', 'notes', 'payment_method', 'delivery_method']);
        
        try {
            $result = $this->orderService->checkoutOrder($userId, $products, $productIds, $data);
            
            return response()->json([
                'message' => 'Order(s) placed successfully',
                'orders' => $result
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to place order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel an order (Customer or Seller action)
     */
    public function cancel(Request $request, $id)
    {
        $reason = $request->input('reason', 'No reason provided');
        
        try {
            $order = $this->orderService->cancelOrder($id, $reason);
            return response()->json([
                'success' => true,
                'message' => 'Order cancelled successfully',
                'order' => $order
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to cancel order: ' . $e->getMessage()
            ], 500);
        }
    }
}
