<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class BookingPolicy
{
    // Hanya customer yang boleh membuat booking
    public function create(User $user): bool
    {
        return $user->role === 'customer';
    }

    // Admin: semua. Customer: miliknya. Organizer: booking event miliknya.
    public function view(User $user, Booking $booking): bool
    {
        return match ($user->role) {
            'admin'     => true,
            'customer'  => $booking->user_id === $user->id,
            'organizer' => $this->organizerOwnsEvent($user, $booking),
            default     => false,
        };
    }

    // Hanya customer pemilik. Admin dan organizer tidak boleh.
    public function pay(User $user, Booking $booking): bool
    {
        return $user->role === 'customer' && $booking->user_id === $user->id;
    }

    public function cancel(User $user, Booking $booking): bool
    {
        return $user->role === 'customer' && $booking->user_id === $user->id;
    }

    // Cek lewat DB::table supaya tetap benar walau event sudah di-soft-delete
    private function organizerOwnsEvent(User $user, Booking $booking): bool
    {
        $eventId = $booking->ticket?->event_id;

        return $eventId !== null
            && DB::table('events')
                ->where('id', $eventId)
                ->where('organizer_id', $user->id)
                ->exists();
    }
}