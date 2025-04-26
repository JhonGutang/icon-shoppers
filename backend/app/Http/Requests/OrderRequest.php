<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'quantity' => 'integer|min:1',
            'total_amount' => 'numeric|min:0',
            'location' => 'string|max:255',
            'status' => 'in:cart,ordered,approved,rejected,to_be_delivered,delivering,recieved,not_recieved,completed',
        ];
    }
}