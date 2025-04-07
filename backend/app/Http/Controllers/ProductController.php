<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{

    public function index()
    {
        $userid = Auth::guard('shop-api')->user()->id;
        $products = Product::where('shop_id', $userid)->get()->values();
        return response()->json($products);
    }

    public function fetchAllProducts(Request $request)
    {
        $query = Product::with('shop:id,name')->where('is_visible', true);

        if ($request->query('type') === 'featured') {
            $query->where('is_featured', true);
        } elseif ($request->query('type') === 'all') {
            // No additional conditions needed for all products
        } else {
            return response()->json([]);
        }

        $products = $query->get()->map(function($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'shop_id' => $product->shop_id,
                'price' => $product->price,
                'quantity' => $product->quantity,
                'image' => $product->image,
                'is_visible' => $product->is_visible,
                'is_featured' => $product->is_featured,
                'shop_name' => $product->shop->name ?? null,
            ];
        });

        return response()->json($products->values());
    }

    public function fetchFeaturedProducts() {
        $products = Product::with('shop:id,name')
            ->where('is_featured', true)
            ->where('is_visible', true)
            ->get()
            ->map(function($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'shop_id' => $product->shop_id,
                    'price' => $product->price,
                    'quantity' => $product->quantity,
                    'image' => $product->image,
                    'is_visible' => $product->is_visible,
                    'is_featured' => $product->is_featured,
                    'shop_name' => $product->shop->name ?? null,
                ];
            });
    
        return response()->json($products->values());
    }
    


    public function fetchSpecificProduct($id){
        $product = Product::with('shop:id,name')->find($id);
        return $product;
    }


    public function create(ProductRequest $request)
    {
        $userId = Auth::guard('shop-api')->user()->id;
        $validatedData = $request->validated();
    
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }
    
        $product = Product::create([
            'shop_id' => $userId,
            'name' => $validatedData['name'],
            'price' => number_format($validatedData['price'], 2, '.', ''),
            'quantity' => $validatedData['quantity'],
            'is_visible' => true,
            'is_featured' => false,
            'image' => $imagePath, 
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
    public function update(ProductRequest $request, $id)
    {
        $validatedData = $request->validated();
    
        if (isset($validatedData['image'])) {
            // $validatedData['image'] = $this->uploadImage($validatedData['image']);
        }
    
        $updateData = [
            'name' => $validatedData['name'] ?? null,
            'price' => isset($validatedData['price']) ? number_format($validatedData['price'], 2, '.', '') : null,
            'quantity' => $validatedData['quantity'] ?? null,
            'image' => $validatedData['image'] ?? null,
            'is_visible' => $validatedData['is_visible'] ?? null,
            'is_featured' => $validatedData['is_featured'] ?? null,
        ];
    
        $updateData = array_filter($updateData, fn($value) => !is_null($value));
        Product::where('id', $id)->update($updateData);
        $product = Product::find($id);
    
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
