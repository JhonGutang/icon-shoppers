<?php

namespace App\Interfaces\Repositories;

interface CategoryRepositoryInterface
{
    public function getAllCategories();

    public function getCategoryBySlug($slug);

    public function getCategoryProducts($categoryId, $page = 1, $perPage = 20);
}
