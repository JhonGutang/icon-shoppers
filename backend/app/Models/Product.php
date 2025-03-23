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
        'is_visible'
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }
}
