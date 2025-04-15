<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShopRating extends Model
{
    protected $fillable = [
        'customer_id',
        'shop_id',
        'rating_score',
        'feedback'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    public function shopRatings()
    {
        return $this->hasMany(ShopRating::class);
    }
}
