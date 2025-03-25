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
        'total_amount',
        'location',
        'status',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    protected $attributes = [
        'status' => 'pending',
    ];


    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
