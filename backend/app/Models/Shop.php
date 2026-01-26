<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    use HasFactory;

    const STATUS_ACTIVE = 'active';
    const STATUS_SUSPENDED = 'suspended';

    protected $fillable = [
        'name',
        'slug',
        'category',
        'owner_id',
        'description',
        'logo_image',
        'banner_image',
        'shipping_fee',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($shop) {
            if (!$shop->slug) {
                $shop->slug = \Illuminate\Support\Str::slug($shop->name);
            }
        });

        static::updating(function ($shop) {
            if ($shop->isDirty('name') && !$shop->isDirty('slug')) {
                $shop->slug = \Illuminate\Support\Str::slug($shop->name);
            }
        });
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}