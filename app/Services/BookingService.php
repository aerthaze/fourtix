<?php

namespace App\Services;

use App\Contracts\Reservable;
use App\Exceptions\SeatUnavailableException;
use App\Models\Booking;
use App\Models\CinemaShow;
use App\Models\ConcertEvent;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class BookingService
{
    public function createBooking(User $user, array $data): Booking
    {
        return DB::transaction(function () use ($user, $data) {
            $ticket = Ticket::with('event')
                ->whereKey($data['ticket_id'])
                ->lockForUpdate()
                ->firstOrFail();

            if (Carbon::parse($ticket->event->event_date)->isPast()) {
                throw new SeatUnavailableException('Event sudah berlalu.');
            }

            $quantity = (int) $data['quantity'];

            $reserved = $this->resolveReservable($ticket->event)
                ->reserveSeat($ticket, $quantity);

            if (! $reserved) {
                throw new SeatUnavailableException('Kursi atau kuota tidak tersedia.');
            }

            return Booking::create([
                'user_id'     => $user->id,
                'ticket_id'   => $ticket->id,
                'quantity'    => $quantity,
                'total_price' => $ticket->price * $quantity,
                'status'      => Booking::STATUS_CONFIRMED,
            ])->load('ticket.event');
        });
    }

    public function cancelBooking(Booking $booking): Booking
    {
        return DB::transaction(function () use ($booking) {
            $booking = Booking::whereKey($booking->id)->lockForUpdate()->firstOrFail();

            if ($booking->isCancelled()) {
                throw new SeatUnavailableException('Booking sudah dibatalkan.');
            }

            $ticket = Ticket::whereKey($booking->ticket_id)->lockForUpdate()->firstOrFail();
            $ticket->decrement('sold', $booking->quantity);

            $booking->update(['status' => Booking::STATUS_CANCELLED]);

            return $booking->load('ticket.event');
        });
    }

    private function resolveReservable(Event $event): Reservable
    {
        return match ($event->type) {
            'cinema'  => CinemaShow::findOrFail($event->id),
            'concert' => ConcertEvent::findOrFail($event->id),
            default   => throw new SeatUnavailableException('Tipe event tidak didukung.'),
        };
    }
}
