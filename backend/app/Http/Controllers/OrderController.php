<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
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

    public function getOrders()
    {
        // Fetch orders with customer info and related order items (products)
        $orders = Order::with(['customer', 'orderItems.product'])->get();

        // Format the data in a way the frontend expects
        $formattedOrders = $orders->map(function($order) {
            return [
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

    public function getCustomersOrders()
{
    $userId = Auth::guard('customer-api')->user()->id;

    $orders = Order::where('customer_id', $userId)
        ->where('status', '!=', 'cart')
        ->with([
            'orderItems.product:id,name,price,shop_id,image',
            'orderItems.product.shop:id,name,email,description,contact_number'
        ])
        ->get();

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



    public function addToCart($id)
    {
        $user = Auth::guard('customer-api')->user();
        $product = Product::findOrFail($id);

        $order = Order::where('customer_id', $user->id)
            ->where('status', 'cart')
            ->first();

            if (!$order) {
                $order = Order::create([
                    'customer_id' => $user->id,
                    'total_amount' => 0,
                    'status' => 'cart',
                ]);
            }

        $orderItem = OrderItem::where('order_id', $order->id)
            ->where('product_id', $id)
            ->first();

        if ($orderItem) {
            $orderItem->quantity += 1;
            $orderItem->price = $orderItem->quantity * $product->price;
            $orderItem->save();
        } else {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $id,
                'quantity' => 1,
                'price' => $product->price,
            ]);
        }

        // Recalculate total order amount
        $order->total_amount = $order->orderItems()->sum('price');
        $order->save();

        return response()->json(['message' => 'Product added to cart successfully']);
    }


    public function removeToCart($id)
    {
        $user = Auth::guard('customer-api')->user();

        $order = Order::where('customer_id', $user->id)
            ->where('status', 'cart')
            ->first();

        if (!$order) {
            return response()->json(['message' => 'No active cart found.'], 404);
        }

        $orderItem = OrderItem::where('order_id', $order->id)
            ->where('product_id', $id)
            ->first();

        if (!$orderItem) {
            return response()->json(['message' => 'Product not found in cart.'], 404);
        }

        $orderItem->delete();

        if ($order->orderItems()->count() == 0) {
            $order->delete();
        } else {
            $order->total_amount = $order->orderItems()->sum('price');
            $order->save();
        }

        return response()->json(['message' => 'Product removed from cart successfully.'], 200);
    }



    public function checkoutOrder(Request $request)
{
    $customerId = Auth::guard('customer-api')->id();

    $order = Order::where('customer_id', $customerId)
        ->where('status', 'cart')
        ->first();

    if (!$order) {
        return response()->json(['message' => 'No active cart found'], 404);
    }

    $totalAmount = 0;

    foreach ($request->products as $productItem) {
        $orderItem = OrderItem::where('order_id', $order->id)
            ->where('product_id', $productItem['id'])
            ->first();

        if (!$orderItem) {
            return response()->json(['message' => 'Product not found in cart'], 404);
        }

        $product = Product::find($productItem['id']);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $orderItem->quantity = $productItem['quantity'];
        $orderItem->price = $product->price * $productItem['quantity'];
        $orderItem->save();

        $totalAmount += $orderItem->price;
    }

    $order->total_amount = $totalAmount;
    $order->status = 'ordered';
    $order->updated_at = now();
    $order->save();

    return response()->json(['message' => 'Order checked out successfully']);
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

        // Get the user's cart order
        $order = Order::where('customer_id', $userId)
            ->where('status', 'cart')
            ->first();

        if (!$order) {
            return response()->json([]); // Return empty array if no order exists
        }

        // Get order items with product & shop details
        $orderItems = OrderItem::where('order_id', $order->id)
            ->with([
                'product:id,name,price,shop_id,image',
                'product.shop:id,name,email,description,contact_number'
            ])
            ->get();

        if ($orderItems->isEmpty()) {
            return response()->json([]); // Return empty array if no items exist
        }

        // Group products by shop
        $grouped = $orderItems->groupBy(function ($orderItem) {
            return $orderItem->product->shop->id;
        })->map(function ($items) {
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
