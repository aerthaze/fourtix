<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'organizer',
            'customer',
        ]);
    }

    public function view(User $user, Ticket $ticket): bool
    {
        return in_array($user->role, [
            'admin',
            'organizer',
            'customer',
        ]);
    }

    public function create(User $user, Event $event): bool
    {
        return $user->role === 'admin'
            || (
                $user->role === 'organizer'
                && (int) $event->organizer_id === (int) $user->id
            );
    }

    public function update(User $user, Ticket $ticket): bool
    {
        return $user->role === 'admin'
            || (
                $user->role === 'organizer'
                && (int) $ticket->event?->organizer_id === (int) $user->id
            );
    }

    public function delete(User $user, Ticket $ticket): bool
    {
        return $user->role === 'admin'
            || (
                $user->role === 'organizer'
                && (int) $ticket->event?->organizer_id === (int) $user->id
            );
    }

    public function restore(User $user, Ticket $ticket): bool
    {
        return $user->role === 'admin'
            || (
                $user->role === 'organizer'
                && (int) $ticket->event?->organizer_id === (int) $user->id
            );
    }
}
