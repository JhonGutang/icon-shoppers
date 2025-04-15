<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductRating extends Model
{
    protected $fillable = [
        'customer_id',
        'product_id',
        'rating_score',
        'feedback'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function productRatings()
    {
        return $this->hasMany(ProductRating::class);
    }
}
