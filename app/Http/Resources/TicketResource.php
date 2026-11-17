<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event_id' => $this->event_id,
            'label' => $this->label,
            'price' => $this->price,
            'quota' => $this->quota,
            'sold' => $this->sold,
            'remaining' => $this->remaining(),

            'is_available' => $this->isAvailable(),
            'status' => $this->markAsSoldOut()
                ? 'sold_out'
                : 'available',

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
