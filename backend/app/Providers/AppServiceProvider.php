<?php

namespace App\Providers;

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ShopController;
use App\Interfaces\CartRepositoryInterface;
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
        
        $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
