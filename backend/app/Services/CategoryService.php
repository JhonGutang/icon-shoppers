<?php

namespace App\Services;

use App\Interfaces\Repositories\CategoryRepositoryInterface;
use App\Interfaces\Services\CategoryServiceInterface;

class CategoryService implements CategoryServiceInterface
{
    protected $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function getAllCategories()
    {
        return $this->categoryRepository->getAllCategories();
    }

    public function getCategoryBySlug($slug)
    {
        return $this->categoryRepository->getCategoryBySlug($slug);
    }
}
