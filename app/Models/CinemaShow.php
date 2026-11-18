<?php

namespace App\Models;

use App\Contracts\Reservable;
use Illuminate\Support\Facades\DB;

class CinemaShow extends Event implements Reservable
{
    protected $table = 'events';

    public function reserveSeat(Ticket $ticket, int $quantity): bool
    {
        if ($this->type !== 'cinema' || $quantity <= 0) {
            return false;
        }

        return DB::transaction(function () use ($ticket, $quantity) {

            $ticketData = Ticket::where('id', $ticket->id)
                ->lockForUpdate()
                ->first();

            if (
                !$ticketData ||
                $ticketData->event_id != $this->id ||
                !$ticketData->isAvailable($quantity)
            ) {
                return false;
            }

            $ticketData->sold += $quantity;
            $ticketData->save();

            return true;
        });
    }
}