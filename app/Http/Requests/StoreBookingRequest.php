<?php

namespace App\Http\Requests;

use App\Models\Booking;
use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    // Hanya customer yang boleh membuat booking
    public function authorize(): bool
    {
        return $this->user()?->can('create', Booking::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['idempotency_key' => $this->header('Idempotency-Key')]);
    }

    public function rules(): array
    {
        return [
            'ticket_id'       => ['required', 'integer', 'exists:tickets,id'],
            'quantity'        => ['required', 'integer', 'min:1', 'max:10'],
            'idempotency_key' => ['required', 'string', 'max:100'],
        ];
    }

    public function messages(): array
    {
        return [
            'idempotency_key.required' => 'Header Idempotency-Key wajib dikirim.',
        ];
    }
}