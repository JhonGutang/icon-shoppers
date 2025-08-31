<?php

namespace App\Providers;

use App\Interfaces\CartRepositoryInterface;
use Illuminate\Support\ServiceProvider;
use App\Interfaces\Services\AuthInterface;
use App\Services\AuthService;
use App\Interfaces\Repositories\CustomerRepositoryInterface;
use App\Interfaces\Services\CartInterface;
use App\Repositories\CartRespository;
use App\Repositories\CustomerRepository;
use App\Services\CartService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(AuthInterface::class, AuthService::class);
        $this->app->bind(CustomerRepositoryInterface::class, CustomerRepository::class);
        $this->app->bind(CartInterface::class, CartService::class);
        $this->app->bind(CartRepositoryInterface::class, CartRespository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
