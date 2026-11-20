<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Venue;

class VenuePolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [
            'admin',
            'organizer',
            'customer',
        ]);
    }

    public function view(User $user, Venue $venue): bool
    {
        return in_array($user->role, [
            'admin',
            'organizer',
            'customer',
        ]);
    }

    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    public function update(User $user, Venue $venue): bool
    {
        return $user->role === 'admin';
    }

    public function delete(User $user, Venue $venue): bool
    {
        return $user->role === 'admin';
    }

    public function restore(User $user, Venue $venue): bool
    {
        return $user->role === 'admin';
    }

    public function forceDelete(User $user, Venue $venue): bool
    {
        return $user->role === 'admin';
    }
}
