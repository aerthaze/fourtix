<?php

namespace Database\Seeders;

use App\Models\Venue;
use Illuminate\Database\Seeder;

class VenueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Venue::create(['name' => 'XXI Ayani Mega Mall', 'address' => 'Jl. Ahmad Yani', 'city' => 'Pontianak']);
        Venue::create(['name' => 'Gedung Olahraga Pontianak', 'address' => 'Jl. Sultan Abdurrahman', 'city' => 'Pontianak']);
    }
}
