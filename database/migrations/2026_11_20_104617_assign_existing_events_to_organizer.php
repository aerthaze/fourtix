<?php

use Illuminate\Database\Migrations\Migration; // Menggunakan fitur migration Laravel
use Illuminate\Support\Facades\DB; // Menggunakan DB untuk menjalankan query

return new class extends Migration
{
    public function up(): void // Fungsi yang dijalankan saat migration
    {
        $hasUnassignedEvents = DB::table('events') // Mengakses tabel events
            ->whereNull('organizer_id') // Mencari Event yang belum punya Organizer
            ->exists(); // Mengecek apakah datanya ada

        if (!$hasUnassignedEvents) { // Jika tidak ada Event yang perlu diisi
            return; // Lewati proses migration
        }

        $organizer = DB::table('users') // Mengakses tabel users
            ->where('role', 'organizer') // Mencari pengguna dengan role organizer
            ->orderBy('id') // Mengurutkan berdasarkan ID terkecil
            ->first(); // Mengambil Organizer pertama

        if (!$organizer) { // Jika akun Organizer tidak ditemukan
            throw new RuntimeException( // Menghentikan migration dengan pesan error
                'Akun Organizer belum tersedia untuk mengisi Event lama.'
            );
        }

        DB::table('events') // Mengakses tabel events
            ->whereNull('organizer_id') // Memilih Event yang belum punya Organizer
            ->update([ // Memperbarui data Event
                'organizer_id' => $organizer->id, // Mengisi ID Organizer
            ]);
    }

    public function down(): void // Fungsi saat migration di-rollback
    {
        // Tidak mengosongkan organizer_id agar kepemilikan Event tidak hilang
    }
};
