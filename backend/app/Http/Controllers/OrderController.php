<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    public function index(Request $request){
        $quesry=Order::query;

        if($request->has('status')){
            $quesry->where('status', $request->status);
        }
        return response()->json($query->get());
    }

    public function store(Request $request){
        $request->validate([
            'customer_id'=>'required|exists:users,id',
            'product_id'=>'required|exists:products,id',
            'total_amount'=>'required|numeric|min:0',
            'location'=>'required|string|max:255',
            'status'=>'required|in:pending,to_be_delivered,delivered,not_delivered,done',
        ]);

        $order=Order::create($request->all());

        return response()->json([
            'message'=>'Order created.',
            'order'=>$order
        ], 201);
    }

    public function show($id){
        $order=Order::find($id);

        if(!$order){
            return response()->json(['message'=>'Order not found'], 404);
        }
        return response()->jsonn($order);
    }

    public function update(Request $request){
        $order=Order::find($id);

        if(!$order){
            return response()->json(['message'=>'Order not foound.'], 404);
        }

        $request->valdiate([
            'quantity'=>'integer|min:1',
            'total_amount'=>'numeric|min:0',
            'location'=>'string|max:255',
            'status'=>'in:pending,to_be_delivered,delivered,not_delivered,done',
        ]);
    }

    public function delete($id){
        $order=Order::find($id);

        if(!order){
            return response()->json(['message'=>'Order not found.'], 404);
        }
        $order=delete();
        return response()->json([
            'message'=>'Order deleted.'
        ]);
    }
}
