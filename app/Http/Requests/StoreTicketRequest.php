<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'event_id' => [
                'required',
                'integer',
                'exists:events,id',
            ],

            'label' => [
                'required',
                'string',
                'max:255',
                Rule::unique('tickets', 'label')
                    ->where('event_id', $this->event_id),
            ],

            'price' => 'required|numeric|min:0',

            'quota' => 'required|integer|min:1',
        ];
    }
}
