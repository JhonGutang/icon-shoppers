<?php

namespace App\Providers;

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ShopController;
use App\Interfaces\CartRepositoryInterface;
use Illuminate\Support\ServiceProvider;
use App\Interfaces\Services\UserServiceInterface;
use App\Interfaces\Repositories\UserRepositoryInterface;
use App\Interfaces\Services\CartServiceInterface;
use App\Repositories\CartRespository;
use App\Repositories\CustomerRepository;
use App\Repositories\ShopRepository;
use App\Services\CartService;
use App\Services\UserService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(UserServiceInterface::class, UserService::class);
        $this->app->bind(UserRepositoryInterface::class, CustomerRepository::class);
        $this->app->bind(CartServiceInterface::class, CartService::class);
        $this->app->bind(CartRepositoryInterface::class, CartRespository::class);


        $this->app->when(ShopController::class)
            ->needs(UserServiceInterface::class)
            ->give(function ($app) {
                return new UserService($app->make(ShopRepository::class));
            });

        $this->app->when(CustomerController::class)
            ->needs(UserServiceInterface::class)
            ->give(function ($app) {
                return new UserService($app->make(CustomerRepository::class));
            });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
