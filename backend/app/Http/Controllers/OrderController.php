<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    public function index(Request $request){
        $orders = Order::with(['customer', 'product'])->get();

        if($request->has('status')){
            $orders->where('status', $request->status);
        }
        return response()->json($orders);
    }

    public function store(Request $request){
        \Log::info('Received order data:', $request->all());
        try {
            $validated = $request->validate([
                'customer_id' => 'required|exists:customers,id',
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1',
                'total_amount' => 'required|numeric|min:0',
                'location' => 'required|string|max:255',
                'status' => 'required|in:pending,to_be_delivered,delivered,not_delivered,done',
            ]);

            $order = Order::create([
                'customer_id' => $validated['customer_id'],
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
                'total_amount' => $validated['total_amount'],
                'location' => $validated['location'],
                'status' => $validated['status'],
            ]);

            if (!$order) {
                \Log::error('Failed to create order', $validated);
                return response()->json(['message' => 'Failed to create order'], 500);
            }

            return response()->json([
                'message' => 'Order created.',
                'order' => $order
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Order creation failed: ' . $e->getMessage());
            return response()->json(['message' => 'Order creation failed', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id){
        $order = Order::find($id);

        if(!$order){
            return response()->json(['message'=>'Order not found'], 404);
        }
        return response()->json($order);
    }

    public function update(Request $request, $id){
        $order = Order::find($id);

        if(!$order){
            return response()->json(['message'=>'Order not found.'], 404);
        }

        $request->validate([
            'quantity'=>'integer|min:1',
            'total_amount'=>'numeric|min:0',
            'location'=>'string|max:255',
            'status'=>'in:pending,to_be_delivered,delivered,not_delivered,done',
        ]);

        $order->update($request->all());
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
}
