<?php

namespace App\Http\Controllers;

use App\Interfaces\Services\CategoryServiceInterface;

class CategoryController extends Controller
{
    protected $categoryService;

    public function __construct(CategoryServiceInterface $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    public function index()
    {
        $categories = $this->categoryService->getAllCategories();

        return response()->json($categories);
    }

    public function show($slug)
    {
        $category = $this->categoryService->getCategoryBySlug($slug);

        return response()->json($category);
    }
}
