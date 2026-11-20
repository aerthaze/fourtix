<?php

namespace App\Http\Requests; 

use Illuminate\Foundation\Http\FormRequest; //menggunakan FormRequest untuk validasi data.

class StoreEventRequest extends FormRequest // Membuat class StoreEventRequest yang mewarisi FormRequest.
{
    public function authorize(): bool //memeriksa apakah request diizinkan untuk dijalankan.
    {
        return true; // Mengizinkan request diproses.
    }

    public function rules(): array //menentukan aturan validasi untuk data Event.
    {
        return [
            'venue_id' => 'required|exists:venues,id', //venue wajib diisi dan harus ada di tabel venues.
            'title' => 'required|string|max:255', //judul wajib diisi, berupa teks, maksimal 255 karakter.
            'type' => 'required|in:cinema,concert', //jenis event wajib diisi dan hanya boleh cinema atau concert.
            'event_date' => 'required|date', //tanggal event wajib diisi dengan format tanggal yang valid.
            'studio' => 'nullable|string|max:255', //studio boleh kosong, tetapi jika diisi harus berupa teks.
        ];
    }
}