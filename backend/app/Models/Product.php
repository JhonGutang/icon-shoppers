<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'shop_id',
        'name',
        'price',
        'quantity',
        'image',
        'is_visible',
        'is_featured'
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class, 'shop_id'); // Ensure the correct foreign key is used
    }
    

    public function orders()
{
    return $this->hasMany(Order::class);
}
}
