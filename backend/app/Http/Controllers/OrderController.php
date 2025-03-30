<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Http\Requests\UpdateOrderRequest;

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

    public function update(UpdateOrderRequest $request, $id){
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
}
