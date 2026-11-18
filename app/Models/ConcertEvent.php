<?php

namespace App\Models;

use App\Contracts\Reservable;
use Illuminate\Support\Facades\DB;

class ConcertEvent extends Event implements Reservable
{
    // Menggunakan tabel events
    protected $table = 'events';

    public function reserveSeat(Ticket $ticket, int $quantity): bool
    {
        // Memastikan event merupakan jenis concert
        if ($this->type !== 'concert' || $quantity <= 0) {
            return false;
        }

        return DB::transaction(function () use ($ticket, $quantity) {

            // Mengunci data tiket selama proses reservasi
            $ticketData = Ticket::where('id', $ticket->id)
                ->lockForUpdate()
                ->first();

            // Memastikan tiket tersedia dan milik event ini
            if (
                !$ticketData ||
                $ticketData->event_id != $this->id ||
                ($ticketData->sold + $quantity) > $ticketData->quota
            ) {
                return false;
            }

            // Menambahkan jumlah tiket terjual
            $ticketData->sold += $quantity;
            $ticketData->save();

            return true;
        });
    }
}