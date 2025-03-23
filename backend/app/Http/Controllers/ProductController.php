<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userid = Auth::guard('shop-api')->user()->id;
        $products = Product::where('shop_id', $userid)->get()->values();
        // asdfsadf
        return response()->json($products);
    }


    public function fetchSpecificProduct($id){
        $product = Product:: find($id);
        return $product;
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(ProductRequest $request)
    {
        $userId = Auth::guard('shop-api')->user()->id;
        $validatedData = $request->validated();

        $product = Product::create([
            'shop_id' => $userId,
            'name' => $validatedData['name'],
            'price' => number_format($validatedData['price'], 2, '.', ''),
            'quantity' => $validatedData['quantity'],
            'image' => null
        ]);

        return response()->json($product);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'quantity' => 'sometimes|required|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $product = Product::findOrFail($id);
        
        if (isset($validatedData['image'])) {
            // Handle image upload if necessary
            // $validatedData['image'] = $this->uploadImage($validatedData['image']);
        }

        $product->update([
            'name' => $validatedData['name'] ?? $product->name,
            'price' => isset($validatedData['price']) ? number_format($validatedData['price'], 2, '.', '') : $product->price,
            'quantity' => $validatedData['quantity'] ?? $product->quantity,
            'image' => $validatedData['image'] ?? $product->image,
        ]);

        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
