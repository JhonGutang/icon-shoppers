<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShopRatingSummary extends Model
{
    protected $table = 'shop_rating_summaries';

    protected $fillable = [
        'shop_id',
        'rating_count',
        'average_rating_score',
    ];

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }
}
