<?php

namespace App\Interfaces\Repositories;

interface ProductRepositoryInterface
{
    public function findProducts(array $ids);
    public function searchProducts($query, $filters = [], $page = 1, $perPage = 20);
    public function getProductsByCategory($categoryId, $filters = [], $page = 1, $perPage = 20);
    public function getFeaturedProducts($page = 1, $perPage = 20);
    public function getTopSellingProducts($page = 1, $perPage = 20);
    public function getRelatedProducts($productId, $limit = 6);
    public function incrementSalesCount($productId, $quantity = 1);
    public function getProductById($id);
    public function getProductBySlug($slug);
}
