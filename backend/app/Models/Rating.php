<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    protected $fillable = ['customer_id', 'rating', 'review'];

    public function rate(): MorphTo{
        return $this->morphTo();
    }
}
