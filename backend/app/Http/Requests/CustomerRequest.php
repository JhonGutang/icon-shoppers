<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Change to true so the request can proceed
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'contact_number' => 'required|string|unique:users,contact_number|max:20',
            'address' => 'required|string|max:500',
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:4',
        ];
    }

    /**
     * Custom messages (optional)
     */
    public function messages(): array
    {
        return [
            'contact_number.unique' => 'This contact number is already taken.',
            'email.unique' => 'This email is already registered.',
            // 'password.confirmed'    => 'Passwords do not match.',
        ];
    }
}
