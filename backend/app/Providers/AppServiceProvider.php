<?php

namespace App\Providers;

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ShopController;
use App\Interfaces\Repositories\CartRepositoryInterface;
use App\Interfaces\Repositories\OrderRepositoryInterface;
use App\Interfaces\Repositories\ProductRepositoryInterface;
use App\Interfaces\Repositories\ShopRepositoryInterface;
use Illuminate\Support\ServiceProvider;
use App\Interfaces\Services\UserServiceInterface;
use App\Interfaces\Repositories\UserRepositoryInterface;
use App\Interfaces\Services\CartServiceInterface;
use App\Interfaces\Services\ImageServiceInterface;
use App\Interfaces\Services\ShopServiceInterface;
use App\Interfaces\Services\OrderServiceInterface;
use App\Repositories\CartRepository;
use App\Repositories\UserRepository;
use App\Repositories\OrderRepository;
use App\Repositories\ProductRepository;
use App\Repositories\ShopRepository;
use App\Services\CartService;
use App\Services\ImageService;
use App\Services\UserService;
use App\Services\ShopService;
use App\Services\OrderService;
use App\Interfaces\Repositories\WishlistRepositoryInterface;
use App\Interfaces\Repositories\AddressRepositoryInterface;
use App\Interfaces\Repositories\ShopFollowerRepositoryInterface;
use App\Interfaces\Repositories\CategoryRepositoryInterface;
use App\Repositories\WishlistRepository;
use App\Repositories\AddressRepository;
use App\Repositories\ShopFollowerRepository;
use App\Repositories\CategoryRepository;
use App\Interfaces\Services\ProductServiceInterface;
use App\Interfaces\Services\WishlistServiceInterface;
use App\Interfaces\Services\AddressServiceInterface;
use App\Interfaces\Services\CategoryServiceInterface;
use App\Services\ProductService;
use App\Services\WishlistService;
use App\Services\AddressService;
use App\Services\CategoryService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(UserServiceInterface::class, UserService::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(CartServiceInterface::class, CartService::class);
        $this->app->bind(CartRepositoryInterface::class, CartRepository::class);
        $this->app->bind(ImageServiceInterface::class, ImageService::class);
        
        $this->app->bind(ShopServiceInterface::class, ShopService::class);
        $this->app->bind(ShopRepositoryInterface::class, ShopRepository::class);

        $this->app->bind(OrderServiceInterface::class, OrderService::class);
        $this->app->bind(OrderRepositoryInterface::class, OrderRepository::class);
        
        $this->app->bind(ProductServiceInterface::class, ProductService::class);
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);

        $this->app->bind(WishlistServiceInterface::class, WishlistService::class);
        $this->app->bind(WishlistRepositoryInterface::class, WishlistRepository::class);

        $this->app->bind(AddressServiceInterface::class, AddressService::class);
        $this->app->bind(AddressRepositoryInterface::class, AddressRepository::class);

        $this->app->bind(CategoryServiceInterface::class, CategoryService::class);
        $this->app->bind(CategoryRepositoryInterface::class, CategoryRepository::class);

        $this->app->bind(ShopFollowerRepositoryInterface::class, ShopFollowerRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
