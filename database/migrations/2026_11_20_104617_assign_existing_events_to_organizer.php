<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $organizer = DB::table('users')
            ->where('role', 'organizer')
            ->orderBy('id')
            ->first();

        if (!$organizer) {
            throw new RuntimeException(
                'Akun Organizer belum tersedia. Jalankan AdminOrganizerSeeder terlebih dahulu.'
            );
        }

        DB::table('events')
            ->whereNull('organizer_id')
            ->update([
                'organizer_id' => $organizer->id,
            ]);
    }

    public function down(): void
    {
        // Tidak mengosongkan organizer_id karena dapat menghapus
        // kepemilikan event yang sudah ditetapkan setelah backfill.
    }
};