<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    // Define the table name if it's not the default plural
    protected $table = 'orders';

    // Mass-assignable attributes
    protected $fillable = [
        'customer_id',
        'product_id',
        'total_amount',
        'location',
        'status',
    ];

    // Casts (optional but recommended for decimals)
    protected $casts = [
        'total_amount' => 'decimal:2',
    ];

    // Default attributes
    protected $attributes = [
        'status' => 'pending',
    ];

    // Relationships

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
