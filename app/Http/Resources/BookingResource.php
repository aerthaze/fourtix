<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'user_id'         => $this->user_id,
            'ticket_id'       => $this->ticket_id,
            'booking_code'    => $this->booking_code,
            'quantity'        => $this->quantity,
            'total_price'     => $this->total_price,
            'status'          => $this->status,
            'expires_at'      => $this->expires_at,
            'paid_at'         => $this->paid_at,
            'cancelled_at'    => $this->cancelled_at,
            'idempotency_key' => $this->idempotency_key,
            'ticket'       => $this->whenLoaded('ticket', fn () => $this->ticket ? [
                'id'    => $this->ticket->id,
                'label' => $this->ticket->label,
                'price' => $this->ticket->price,
            ] : null),
            'event'        => $this->whenLoaded('ticket', fn () => $this->ticket?->event ? [
                'id'         => $this->ticket->event->id,
                'title'      => $this->ticket->event->title,
                'type'       => $this->ticket->event->type,
                'event_date' => $this->ticket->event->event_date,
            ] : null),
            'created_at'   => $this->created_at,
        ];
    }
}