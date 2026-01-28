<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    const ROLE_CUSTOMER = 'customer';

    const ROLE_MERCHANT = 'merchant';

    const ROLE_ADMIN = 'admin';

    const STATUS_ACTIVE = 'active';

    const STATUS_SUSPENDED = 'suspended';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'middle_name',
        'email',
        'phone',
        'contact_number',
        'address',
        'street',
        'barangay',
        'city',
        'postal_code',
        'role',
        'status',
        'avatar',
        'profile_picture',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isCustomer(): bool
    {
        return $this->role === self::ROLE_CUSTOMER;
    }

    public function isMerchant(): bool
    {
        return $this->role === self::ROLE_MERCHANT;
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function shop()
    {
        return $this->hasOne(Shop::class, 'owner_id');
    }

    public function hasShop(): bool
    {
        return $this->shop()->exists();
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id');
    }

    public function cart()
    {
        return $this->hasOne(Cart::class, 'user_id');
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function followedShops()
    {
        return $this->belongsToMany(Shop::class, 'shop_followers');
    }

    public function reviews()
    {
        return $this->hasMany(ProductRating::class);
    }
}
