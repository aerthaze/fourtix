<?php

namespace App\Http\Requests; // Menentukan namespace file UpdateEventRequest.

use Illuminate\Foundation\Http\FormRequest; // Menggunakan fitur FormRequest dari Laravel.

class UpdateEventRequest extends FormRequest // Membuat class UpdateEventRequest dengan mewarisi FormRequest.
{
    public function authorize(): bool // Memeriksa apakah request diperbolehkan.
    {
        return true; // Mengizinkan request diproses.
    }

    public function rules(): array // Menentukan aturan validasi untuk proses update.
    {
        return [
            'venue_id' => 'sometimes|required|exists:venues,id', // Divalidasi jika dikirim, wajib memiliki ID Venue yang tersedia.
            'title' => 'sometimes|required|string|max:255', // Judul divalidasi jika dikirim dan tidak boleh kosong.
            'type' => 'sometimes|required|in:cinema,concert', // Jenis event divalidasi jika dikirim.
            'event_date' => 'sometimes|required|date', // Tanggal event divalidasi jika dikirim.
            'studio' => 'sometimes|nullable|string|max:255', // Studio boleh tidak dikirim atau dikosongkan.
        ];
    }
}