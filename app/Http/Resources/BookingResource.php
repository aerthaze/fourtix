<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'           => $this->id,
            'booking_code' => $this->booking_code,
            'status'       => $this->status,
            'quantity'     => $this->quantity,
            'total_price'  => $this->total_price,
            'ticket'       => $this->whenLoaded('ticket', fn() => [
                'id'    => $this->ticket->id,
                'label' => $this->ticket->label,
                'price' => $this->ticket->price,
            ]),
            'event'        => $this->whenLoaded('ticket', fn() => [
                'id'         => $this->ticket->event->id,
                'title'      => $this->ticket->event->title,
                'type'       => $this->ticket->event->type,
                'event_date' => $this->ticket->event->event_date,
            ]),
            'created_at'   => $this->created_at,
        ];
    }
}
