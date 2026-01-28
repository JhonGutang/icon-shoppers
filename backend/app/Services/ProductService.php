<?php

namespace App\Services;

use App\Interfaces\Repositories\ProductRepositoryInterface;
use App\Interfaces\Services\ProductServiceInterface;

class ProductService implements ProductServiceInterface
{
    protected $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function searchProducts($query, $filters = [], $page = 1, $perPage = 20)
    {
        return $this->productRepository->searchProducts($query, $filters, $page, $perPage);
    }

    public function getProductDetails($slug)
    {
        return $this->productRepository->getProductBySlug($slug);
    }

    public function getProductsByCategory($categoryId, $filters = [], $page = 1, $perPage = 20)
    {
        return $this->productRepository->getProductsByCategory($categoryId, $filters, $page, $perPage);
    }

    public function getFeaturedProducts($page = 1, $perPage = 20)
    {
        return $this->productRepository->getFeaturedProducts($page, $perPage);
    }

    public function getTopSellingProducts($page = 1, $perPage = 20)
    {
        return $this->productRepository->getTopSellingProducts($page, $perPage);
    }

    public function getRelatedProducts($productId, $limit = 6)
    {
        return $this->productRepository->getRelatedProducts($productId, $limit);
    }
}
