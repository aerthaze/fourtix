<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\Booking;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class EventController extends Controller
{
    public function index()
    {
        Gate::authorize('viewAny', Event::class); // Memeriksa apakah pengguna boleh melihat daftar event melalui EventPolicy

        $events = Event::all(); // Mengambil semua data event yang belum dihapus dari database

        return response()->json([ // Mengembalikan response dalam format JSON
            'message' => 'Daftar event berhasil diambil',
            'data' => EventResource::collection($events) // Mengubah kumpulan data event menjadi format EventResource
        ], 200); // Mengirim status HTTP 200 yang menandakan permintaan berhasil
    }

    public function store(StoreEventRequest $request)
    {
        Gate::authorize('create', Event::class); // Memeriksa apakah pengguna memiliki hak untuk membuat event

        $validated = $request->validated(); // Mengambil data yang sudah lolos validasi StoreEventRequest

        if (
            $request->user()->role === 'organizer' && // Memeriksa apakah pengguna yang sedang login merupakan organizer
            !in_array($validated['type'], ['cinema', 'concert']) // Memastikan jenis event yang dibuat hanya cinema atau concert
        ) {
            return response()->json([
                'message' => 'Organizer hanya dapat membuat event cinema atau concert.'
            ], 403); // Menolak pembuatan event jika jenisnya tidak diperbolehkan
        }

        $event = Event::create([ // Membuat data event baru ke dalam database
            ...$validated, // Memasukkan seluruh data yang sudah divalidasi
            'organizer_id' => $request->user()->id, // Menyimpan ID pengguna yang membuat event sebagai pemilik event
        ]);

        return response()->json([ // Mengembalikan informasi event yang berhasil dibuat
            'message' => 'Event berhasil ditambahkan',
            'data' => new EventResource($event) // Mengubah data event menjadi format EventResource
        ], 201); // Mengirim status HTTP 201 yang menandakan data berhasil dibuat
    }

    public function show(string $id)
    {
        $event = Event::find($id); // Mencari event berdasarkan ID yang diberikan

        if (!$event) { // Memeriksa apakah event tidak ditemukan
            return response()->json([
                'message' => 'Event tidak ditemukan'
            ], 404); // Mengirim status HTTP 404 jika event tidak ditemukan
        }

        Gate::authorize('view', $event); // Memeriksa apakah pengguna boleh melihat detail event melalui EventPolicy

        return response()->json([ // Mengembalikan detail event dalam format JSON
            'message' => 'Detail event berhasil diambil',
            'data' => new EventResource($event) // Mengubah data event menjadi format EventResource
        ], 200); // Mengirim status HTTP 200 yang menandakan permintaan berhasil
    }

    public function update(UpdateEventRequest $request, string $id)
    {
        $event = Event::find($id); // Mencari event berdasarkan ID yang akan diperbarui

        if (!$event) { // Memeriksa apakah event tidak ditemukan
            return response()->json([
                'message' => 'Event tidak ditemukan'
            ], 404); // Mengirim status HTTP 404 jika event tidak ditemukan
        }

        Gate::authorize('update', $event); // Memeriksa hak pengguna untuk mengubah event melalui EventPolicy

        $validated = $request->validated(); // Mengambil data perubahan yang sudah lolos validasi

        $event->update($validated); // Memperbarui data event berdasarkan data yang sudah divalidasi

        return response()->json([ // Mengembalikan informasi event setelah diperbarui
            'message' => 'Event berhasil diperbarui',
            'data' => new EventResource($event) // Mengubah data event terbaru menjadi format EventResource
        ], 200); // Mengirim status HTTP 200 yang menandakan data berhasil diperbarui
    }

    public function destroy(string $id)
    {
        $event = Event::find($id); // Mencari event yang akan dihapus berdasarkan ID

        if (!$event) { // Memeriksa apakah event tidak ditemukan
            return response()->json([
                'message' => 'Event tidak ditemukan'
            ], 404); // Mengirim status HTTP 404 jika event tidak ditemukan
        }

        Gate::authorize('delete', $event); // Memeriksa hak pengguna untuk menghapus event melalui EventPolicy

        $hasPendingBooking = DB::transaction(function () use ($event) { // Menjalankan proses penghapusan dalam transaksi database

            $tickets = Ticket::withTrashed() // Mengambil seluruh tiket termasuk tiket yang sudah di-soft delete
                ->where('event_id', $event->id) // Memilih tiket yang berhubungan dengan event tersebut
                ->lockForUpdate() // Mengunci baris tiket agar tidak diubah transaksi lain selama proses berlangsung
                ->get(); // Mengambil seluruh data tiket yang sesuai

            $ticketIds = $tickets->pluck('id'); // Mengambil seluruh ID tiket untuk memeriksa booking yang terkait

            $hasPendingBooking = Booking::whereIn('ticket_id', $ticketIds) // Mencari booking berdasarkan ID tiket milik event
                ->where('status', 'pending') // Memilih booking yang masih berstatus pending
                ->exists(); // Memeriksa apakah terdapat minimal satu booking pending

            if ($hasPendingBooking) { // Memeriksa apakah event masih memiliki booking pending
                return true; // Menghentikan proses penghapusan dan memberi tanda bahwa masih ada booking pending
            }

            $event->delete(); // Melakukan soft delete pada event dengan mengisi kolom deleted_at

            $event->tickets()->delete(); // Melakukan soft delete pada seluruh tiket event yang belum terhapus

            return false; // Menandakan proses penghapusan berhasil dilakukan
        });

        if ($hasPendingBooking) { // Memeriksa hasil transaksi apakah ditemukan booking pending
            return response()->json([
                'message' => 'Event tidak dapat dihapus karena masih memiliki booking pending.'
            ], 409); // Mengirim status HTTP 409 Conflict karena penghapusan bertentangan dengan kondisi booking
        }

        return response()->json([ // Mengembalikan informasi bahwa event berhasil dihapus
            'message' => 'Event dan tiket terkait berhasil dihapus'
        ], 200); // Mengirim status HTTP 200 yang menandakan proses berhasil
    }

    public function restore(string $id)
    {
        $event = Event::withTrashed()->find($id); // Mencari event berdasarkan ID termasuk event yang sudah di-soft delete

        if (!$event) { // Memeriksa apakah event tidak ditemukan
            return response()->json([
                'message' => 'Event tidak ditemukan'
            ], 404); // Mengirim status HTTP 404 jika event tidak ditemukan
        }

        if (!$event->trashed()) { // Memeriksa apakah event sebenarnya tidak dalam kondisi terhapus
            return response()->json([
                'message' => 'Event tidak dalam kondisi terhapus'
            ], 422); // Mengirim status HTTP 422 jika event tidak perlu dipulihkan
        }

        Gate::authorize('restore', $event); // Memeriksa hak pengguna untuk memulihkan event melalui EventPolicy

        DB::transaction(function () use ($event) { // Menjalankan proses pemulihan dalam transaksi database

            $tickets = Ticket::withTrashed() // Mengambil seluruh tiket termasuk yang sudah di-soft delete
                ->where('event_id', $event->id) // Memilih tiket yang berhubungan dengan event tersebut
                ->lockForUpdate() // Mengunci baris tiket selama proses pemulihan berlangsung
                ->get(); // Mengambil seluruh data tiket yang sesuai

            $event->restore(); // Memulihkan event dengan mengosongkan kolom deleted_at

            $event->tickets()->withTrashed()->restore(); // Memulihkan seluruh tiket terkait yang sebelumnya di-soft delete
        });

        $event->refresh(); // Memuat ulang data event setelah proses pemulihan selesai

        return response()->json([ // Mengembalikan informasi event yang berhasil dipulihkan
            'message' => 'Event dan tiket terkait berhasil dipulihkan',
            'data' => new EventResource($event) // Mengubah data event yang sudah dipulihkan menjadi format EventResource
        ], 200); // Mengirim status HTTP 200 yang menandakan proses berhasil
    }
}
