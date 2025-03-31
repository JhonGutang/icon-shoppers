<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Http\Requests\OrderRequest;

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
        // Get logged in seller's ID
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

        // Group orders by status
        $groupedOrders = $orders->groupBy('status');

        return response()->json([
            'orders' => $groupedOrders,
            'total_orders' => $orders->count(),
            'pending_orders' => $orders->where('status', 'ordered')->count(),
            'completed_orders' => $orders->where('status', 'completed')->count(),
        ]);
    }
}
