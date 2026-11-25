<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function viewAny(User $user): bool
    {
        return true; // Semua pengguna yang sudah login boleh melihat daftar Event.

    }

    public function view(User $user, Event $event): bool
    {
        return true; // Pengguna yang sudah login boleh melihat detail event
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['admin', 'organizer']); // Admin dan organizer boleh membuat event
    }

    public function update(User $user, Event $event): bool
    {
        return $user->role === 'admin' || // Admin boleh mengubah semua event
            (
                $user->role === 'organizer' && // Memastikan pengguna merupakan organizer
                $event->organizer_id === $user->id // Organizer hanya boleh mengubah event miliknya sendiri
            );
    }

    public function delete(User $user, Event $event): bool
    {
        return $user->role === 'admin' || // Admin boleh menghapus semua event
            (
                $user->role === 'organizer' && // Memastikan pengguna merupakan organizer
                $event->organizer_id === $user->id // Organizer hanya boleh menghapus event miliknya sendiri
            );
    }

    public function restore(User $user, Event $event): bool
    {
        return $user->role === 'admin' || // Admin boleh memulihkan semua event
            (
                $user->role === 'organizer' && // Memastikan pengguna merupakan organizer
                $event->organizer_id === $user->id // Organizer hanya boleh memulihkan event miliknya sendiri
            );
    }

    public function forceDelete(User $user, Event $event): bool
    {
        return $user->role === 'admin'; // Hanya admin yang boleh menghapus event secara permanen
    }
}
