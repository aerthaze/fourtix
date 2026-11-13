<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [ //digunakan untuk menentukan kolom mana saja yang boleh diisi secara massal (mass assignment) saat membuat atau memperbarui data Event. Ini membantu mencegah serangan mass assignment.
        'venue_id',
        'title',
        'type',
        'event_date',
        'studio',
    ];

    protected function casts(): array //digunakan untuk mengatur tipe data dari kolom event_date menjadi datetime. Dengan begitu, saat mengambil data event_date dari database, nilainya akan otomatis dikonversi menjadi objek DateTime di PHP.
    {
        return [
            'event_date' => 'datetime', //nilai event_date akan dikonversi menjadi objek DateTime saat diambil dari database
        ];
    }

    // Menghubungkan Event dengan Venue
    public function venue() //membuat fungsi bernama venue() yang menghubungkan model Event dengan model Venue. Fungsi ini menggunakan relasi belongsTo, yang berarti setiap Event memiliki satu Venue. Dengan relasi ini, kita dapat mengakses data Venue yang terkait dengan Event tertentu melalui properti venue pada objek Event.
    {
        return $this->belongsTo(Venue::class); // Setiap Event memiliki satu Venue
    }
}