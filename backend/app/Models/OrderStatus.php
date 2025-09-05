<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrderStatus extends Model
{
    protected $fillable = [
        'status',
    ];

    /**
     * Get the orders for the order status.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}
