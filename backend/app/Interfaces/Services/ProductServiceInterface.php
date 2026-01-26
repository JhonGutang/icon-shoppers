<?php

namespace App\Interfaces\Services;

interface ProductServiceInterface
{
    public function searchProducts($query, $filters = [], $page = 1, $perPage = 20);
    public function getProductDetails($slug);
    public function getProductsByCategory($categoryId, $filters = [], $page = 1, $perPage = 20);
    public function getFeaturedProducts($page = 1, $perPage = 20);
    public function getTopSellingProducts($page = 1, $perPage = 20);
    public function getRelatedProducts($productId, $limit = 6);
}
