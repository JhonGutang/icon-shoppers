<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ShopCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:shops,name',
            'description' => 'required|string',
            'category' => 'required|string',
            'logo_image' => 'nullable|image|max:2048',
            'banner_image' => 'nullable|image|max:5120',
        ];
    }
}
