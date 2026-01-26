<?php

namespace App\Repositories;

use App\Models\Category;
use App\Interfaces\Repositories\CategoryRepositoryInterface;

class CategoryRepository implements CategoryRepositoryInterface
{
    protected $model;

    public function __construct(Category $category)
    {
        $this->model = $category;
    }

    public function getAllCategories()
    {
        return $this->model
            ->withCount('products')
            ->orderBy('name')
            ->get();
    }

    public function getCategoryBySlug($slug)
    {
        return $this->model
            ->where('slug', $slug)
            ->withCount('products')
            ->firstOrFail();
    }

    public function getCategoryProducts($categoryId, $page = 1, $perPage = 20)
    {
        return $this->model
            ->findOrFail($categoryId)
            ->products()
            ->published()
            ->with(['shop', 'ratings'])
            ->paginate($perPage, ['*'], 'page', $page);
    }
}
