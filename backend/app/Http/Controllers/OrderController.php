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
            'status'=>'in:cart,ordered,approved,rejected,to_be_delivered,recieved,not_recieved,completed',
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
