<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [
        'customer_id',
        'product_id',
        'shop_id',
        'total_amount',
        'location',
        'status',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    protected $attributes = [
        'status' => 'ordered',
    ];


    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }
}
