<?php

namespace App\Interfaces\Services;

interface CategoryServiceInterface
{
    public function getAllCategories();
    public function getCategoryBySlug($slug);
}
