<?php

namespace App\Http\Resources; // Menentukan namespace untuk file Resource.

use Illuminate\Http\Request; // Menggunakan Request untuk menerima informasi request.
use Illuminate\Http\Resources\Json\JsonResource; // Menggunakan JsonResource untuk mengubah data menjadi JSON.

class EventResource extends JsonResource // Membuat EventResource yang mewarisi JsonResource.
{
    public function toArray(Request $request): array // Mengubah data Event menjadi array untuk response JSON.
    {
        return [
            'id' => $this->id, // Menampilkan ID Event.
            'venue_id' => $this->venue_id, // Menampilkan ID Venue tempat Event berlangsung.
            'organizer_id' => $this->organizer_id, // Menampilkan ID pengguna yang memiliki Event.
            'title' => $this->title, // Menampilkan judul Event.
            'type' => $this->type, // Menampilkan jenis Event, cinema atau concert.
            'event_date' => $this->event_date, // Menampilkan tanggal dan waktu pelaksanaan Event.
            'studio' => $this->studio, // Menampilkan nama studio jika Event berupa cinema.
            'created_at' => $this->created_at, // Menampilkan waktu data Event dibuat.
            'updated_at' => $this->updated_at, // Menampilkan waktu terakhir data Event diperbarui.
            'deleted_at' => $this->deleted_at, // Menampilkan waktu Event dihapus atau null jika belum dihapus.
        ];
    }
}
