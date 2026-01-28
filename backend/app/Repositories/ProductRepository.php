<?php

namespace App\Repositories;

use App\Interfaces\Repositories\ProductRepositoryInterface;
use App\Models\Product;

class ProductRepository implements ProductRepositoryInterface
{
    const DEFAULT_PER_PAGE = 20;

    const MAX_PER_PAGE = 100;

    protected $model;

    public function __construct(Product $product)
    {
        $this->model = $product;
    }

    public function findProducts($ids)
    {
        $products = Product::with('shop')->whereIn('id', $ids)->get()->keyBy('id');

        return $products;
    }

    public function searchProducts($query, $filters = [], $page = 1, $perPage = self::DEFAULT_PER_PAGE)
    {
        $perPage = min($perPage, self::MAX_PER_PAGE);

        $queryBuilder = $this->model->query()
            ->published()
            ->where('is_visible', true)
            ->with(['shop', 'category', 'ratings']);

        // Search by name or description
        if (! empty($query)) {
            $queryBuilder->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%");
            });
        }

        // Filter by category
        if (! empty($filters['category_id'])) {
            $queryBuilder->where('category_id', $filters['category_id']);
        }

        // Filter by price range
        if (! empty($filters['min_price'])) {
            $queryBuilder->where('price', '>=', $filters['min_price']);
        }
        if (! empty($filters['max_price'])) {
            $queryBuilder->where('price', '<=', $filters['max_price']);
        }

        // Filter by rating
        if (! empty($filters['min_rating'])) {
            $queryBuilder->whereHas('ratings', function ($q) use ($filters) {
                $q->havingRaw('AVG(rating) >= ?', [$filters['min_rating']]);
            });
        }

        // Sorting
        $sortBy = $filters['sort'] ?? $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';

        switch ($sortBy) {
            case 'price_asc':
                $queryBuilder->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $queryBuilder->orderBy('price', 'desc');
                break;
            case 'popular':
                $queryBuilder->orderBy('sales_count', 'desc');
                break;
            case 'newest':
                $queryBuilder->orderBy('created_at', 'desc');
                break;
            case 'rating':
                $queryBuilder->withAvg('ratings', 'rating')
                    ->orderBy('ratings_avg_rating', 'desc');
                break;
            case 'featured':
                $queryBuilder->orderBy('is_featured', 'desc')
                    ->orderBy('created_at', 'desc');
                break;
            default:
                // Handle arbitrary column sorting if needed, but safe-guard it
                $allowedSorts = ['created_at', 'price', 'sales_count', 'name'];
                if (in_array($sortBy, $allowedSorts)) {
                    $queryBuilder->orderBy($sortBy, $sortOrder);
                } else {
                    $queryBuilder->orderBy('created_at', 'desc');
                }
        }

        return $queryBuilder->paginate($perPage, ['*'], 'page', $page);
    }

    public function getProductsByCategory($categoryId, $filters = [], $page = 1, $perPage = self::DEFAULT_PER_PAGE)
    {
        $filters['category_id'] = $categoryId;

        return $this->searchProducts('', $filters, $page, $perPage);
    }

    public function getFeaturedProducts($page = 1, $perPage = self::DEFAULT_PER_PAGE)
    {
        $perPage = min($perPage, self::MAX_PER_PAGE);

        return $this->model
            ->published()
            ->featured()
            ->with(['shop', 'category', 'ratings'])
            ->withAvg('ratings', 'rating')
            ->orderBy('ratings_avg_rating', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function getTopSellingProducts($page = 1, $perPage = self::DEFAULT_PER_PAGE)
    {
        $perPage = min($perPage, self::MAX_PER_PAGE);

        return $this->model
            ->published()
            ->with(['shop', 'category', 'ratings'])
            ->orderBy('sales_count', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);
    }

    public function getRelatedProducts($productId, $limit = 6)
    {
        $product = $this->model->findOrFail($productId);

        return $this->model
            ->published()
            ->where('id', '!=', $productId)
            ->where(function ($query) use ($product) {
                $query->where('category_id', $product->category_id)
                    ->orWhere('shop_id', $product->shop_id);
            })
            ->with(['shop', 'category', 'ratings'])
            ->withAvg('ratings', 'rating')
            ->orderBy('ratings_avg_rating', 'desc')
            ->limit($limit)
            ->get();
    }

    public function incrementSalesCount($productId, $quantity = 1)
    {
        return $this->model
            ->where('id', $productId)
            ->increment('sales_count', $quantity);
    }

    public function getProductById($id)
    {
        return Product::with(['shop', 'category', 'ratings.user', 'variants'])
            ->withAvg('ratings', 'rating')
            ->withCount('ratings')
            ->findOrFail($id);
    }

    public function getProductBySlug($slug)
    {
        return Product::with(['shop', 'category', 'ratings.user', 'variants'])
            ->where('slug', $slug)
            ->firstOrFail();
    }
}
