<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Database\Seeder;
use RuntimeException;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $organizer = User::where('role', 'organizer')
            ->orderBy('id')
            ->first(); // Mengambil akun Organizer pertama.

        if (!$organizer) {
            throw new RuntimeException('Akun Organizer belum tersedia.');
        }

        $cinemaVenue = Venue::where('name', 'XXI Ayani Mega Mall')->first(); // Mengambil Venue Cinema.
        $concertVenue = Venue::where('name', 'Gedung Olahraga Pontianak')->first(); // Mengambil Venue Concert.

        if (!$cinemaVenue || !$concertVenue) {
            throw new RuntimeException('Data Venue belum tersedia. Jalankan VenueSeeder terlebih dahulu.');
        }

        Event::updateOrCreate(
            [
                'title' => 'Avengers: Endgame',
                'type' => 'cinema',
            ],
            [
                'venue_id' => $cinemaVenue->id,
                'organizer_id' => $organizer->id,
                'event_date' => now()->addDays(7),
                'studio' => 'Studio 1',
            ]
        );

        Event::updateOrCreate(
            [
                'title' => 'Konser Musik UNTAN',
                'type' => 'concert',
            ],
            [
                'venue_id' => $concertVenue->id,
                'organizer_id' => $organizer->id,
                'event_date' => now()->addDays(14),
                'studio' => null,
            ]
        );
    }
}
