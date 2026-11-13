<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_id' => 'sometimes|required|integer|exists:events,id',
            'label' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'quota' => 'sometimes|required|integer|min:1',
        ];
    }
}