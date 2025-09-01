<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'shop_id',
        'name',
        'price',
        'quantity',
        'image',
        'is_visible',
        'is_featured',
        'description',
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class, 'shop_id');
    }


    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function ratings()
    {
        return $this->hasMany(ProductRating::class);
    }

}
