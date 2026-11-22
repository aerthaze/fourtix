<?php

namespace App\Http\Requests;

use App\Models\Ticket;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTicketRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $ticket = $this->route('ticket');

        $eventId = $this->input(
            'event_id',
            $ticket instanceof Ticket ? $ticket->event_id : null
        );

        return [
            'event_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:events,id',
            ],

            'label' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('tickets', 'label')
                    ->where('event_id', $eventId)
                    ->whereNull('deleted_at')
                    ->ignore($ticket instanceof Ticket ? $ticket->id : null),
            ],

            'price' => 'sometimes|required|numeric|min:0',

            'quota' => 'sometimes|required|integer|min:0',
        ];
    }
}
