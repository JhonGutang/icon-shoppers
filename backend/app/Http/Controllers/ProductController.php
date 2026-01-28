<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Interfaces\Services\ImageServiceInterface;
use App\Interfaces\Services\ProductServiceInterface;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    protected $productService;

    protected $imageService;

    public function __construct(ProductServiceInterface $productService, ImageServiceInterface $imageService)
    {
        $this->productService = $productService;
        $this->imageService = $imageService;
    }

    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $shop = $user->shop;

        if (! $shop) {
            return response()->json([], 404);
        }

        $products = Product::where('shop_id', $shop->id)->get()->values();

        return response()->json($products);
    }

    /**
     * Customer facing product listing with search, filtering and pagination
     */
    public function fetchAllProducts(Request $request)
    {
        $query = $request->query('query') ?? $request->query('search');
        $filters = $request->only(['category_id', 'min_price', 'max_price', 'rating', 'sort', 'type']);
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 20);

        // Map type=featured to internal filter if needed
        if ($request->query('type') === 'featured') {
            return $this->fetchFeaturedProducts($request);
        }

        $products = $this->productService->searchProducts($query, $filters, $page, $perPage);

        return response()->json($products);
    }

    public function fetchFeaturedProducts(Request $request)
    {
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 20);
        $products = $this->productService->getFeaturedProducts($page, $perPage);

        return response()->json($products);
    }

    public function fetchSpecificProduct($slug)
    {
        // Support both ID and Slug for backward compatibility if needed,
        // but Unified Flow uses Slugs for SEO
        if (is_numeric($slug)) {
            $product = Product::with(['shop', 'category', 'ratings.user', 'variants'])->findOrFail($slug);
        } else {
            $product = $this->productService->getProductDetails($slug);
        }

        if (! $product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product);
    }

    public function fetchRelatedProducts($id)
    {
        $products = $this->productService->getRelatedProducts($id);

        return response()->json($products);
    }

    public function fetchTopSellingProducts(Request $request)
    {
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 20);
        $products = $this->productService->getTopSellingProducts($page, $perPage);

        return response()->json($products);
    }

    public function fetchByCategory(Request $request, $categoryId)
    {
        $filters = $request->only(['min_price', 'max_price', 'rating', 'sort']);
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 20);

        $products = $this->productService->getProductsByCategory($categoryId, $filters, $page, $perPage);

        return response()->json($products);
    }

    /**
     * Merchant operations below
     */
    public function create(ProductRequest $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $shop = $user->shop;

        if (! $shop) {
            return response()->json(['message' => 'Shop not found'], 404);
        }

        $validatedData = $request->validated();

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $this->imageService->uploadImage($request->file('image'), 'products', $shop->slug);
        }

        $product = Product::create([
            'shop_id' => $shop->id,
            'category_id' => $validatedData['category_id'] ?? null,
            'name' => $validatedData['name'],
            'price' => number_format($validatedData['price'], 2, '.', ''),
            'quantity' => $validatedData['quantity'],
            'stock' => $validatedData['quantity'], // Sync initial stock
            'status' => Product::STATUS_PUBLISHED,
            'is_visible' => true,
            'is_featured' => false,
            'image' => $imagePath,
            'description' => $validatedData['description'] ?? null,
        ]);

        return response()->json($product, 201);
    }

    public function update(ProductRequest $request, $id)
    {
        $product = Product::findOrFail($id);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($product->shop_id !== $user->shop->id) {
            return response()->json(['message' => 'Unauthorized. This product does not belong to your shop.'], 403);
        }

        $validatedData = $request->validated();

        $updateData = [
            'category_id' => $validatedData['category_id'] ?? $product->category_id,
            'name' => $validatedData['name'] ?? $product->name,
            'price' => isset($validatedData['price']) ? number_format($validatedData['price'], 2, '.', '') : $product->price,
            'quantity' => $validatedData['quantity'] ?? $product->quantity,
            'stock' => $validatedData['quantity'] ?? $product->stock,
            'is_visible' => $validatedData['is_visible'] ?? $product->is_visible,
            'is_featured' => $validatedData['is_featured'] ?? $product->is_featured,
            'status' => $validatedData['status'] ?? $product->status,
        ];

        if ($request->hasFile('image')) {
            $imagePath = $this->imageService->uploadImage($request->file('image'), 'products', $product->shop->slug);
            $updateData['image'] = $imagePath;
        }

        $product->update($updateData);

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $user = Auth::user();
        if ($product->shop_id !== $user->shop->id) {
            return response()->json(['message' => 'Unauthorized. This product does not belong to your shop.'], 403);
        }

        $deleted = $product->delete();
        if ($deleted) {
            $this->imageService->deleteImageIfExists($product->image);
        }

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
