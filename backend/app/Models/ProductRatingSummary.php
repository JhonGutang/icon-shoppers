<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductRatingSummary extends Model
{
    protected $table = 'product_rating_summary';

    protected $fillable = [
        'product_id',
        'rating_count',
        'average_rating_score',
    ];

    public function product(){
        return $this->belongsTo(Product::class);
    }
}
