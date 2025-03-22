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
            'price' => $validatedData['price'],
            'quantity' => $validatedData['quantity'],
            'image' => null
        ]);

        return response()->json(
            [ 'product' => $product]
        );
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
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
