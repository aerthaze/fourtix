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

class EventController extends Controller
{

    public function index()
    {
        $events = Event::all(); // Mengambil semua data event dari database

        return response()->json([ // Mengembalikan response JSON dengan status code 200 (OK)
            'message' => 'Daftar event berhasil diambil',
            'data' => EventResource::collection($events) // Mengubah semua data event menjadi format Resource sebelum dikirim dalam response JSON
        ], 200); //menunjukkan permintaan berhasil diproses dan data berhasil diambil dari database
    }

    public function store(StoreEventRequest $request)
    {
        $validated = $request->validated();

        $event = Event::create([
            ...$validated,
            'organizer_id' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Event berhasil ditambahkan',
            'data' => new EventResource($event)
        ], 201);
    }

    public function show(string $id)
    {
        // Mencari data event berdasarkan ID
        $event = Event::find($id); //digunakan untuk mencari satu data event berdasarkan ID yang diberikan. Jika data event ditemukan, maka akan disimpan dalam variabel $event, jika tidak ditemukan maka akan bernilai null

        // Memeriksa apakah event ditemukan
        if (!$event) { //memeriksa apakah data event ditemukan atau tidak. Jika tidak ditemukan, maka akan mengembalikan response JSON dengan status code 404 (Not Found) dan pesan bahwa event tidak ditemukan
            return response()->json([
                'message' => 'Event tidak ditemukan'
            ], 404); //berarti data yang dicari tidak ditemukan di database, sehingga mengembalikan response JSON dengan status code 404 (Not Found)
        }

        // Mengembalikan detail event dalam bentuk JSON
        return response()->json([
            'message' => 'Detail event berhasil diambil',
            'data' => new EventResource($event) // Mengubah data event yang ditemukan menjadi format EventResource sebelum dikirim dalam response JSON
        ], 200);
    }

    public function update(UpdateEventRequest $request, string $id)
    { 
        $event = Event::find($id); // Mencari data event berdasarkan ID
 
        if (!$event) { // Memeriksa apakah event ditemukan
            return response()->json([
                'message' => 'Event tidak ditemukan'
            ], 404);
        }

        $user = $request->user(); // Mengambil data pengguna yang sedang login

        if ( // Memeriksa kepemilikan event
            $user->role === 'organizer' &&
            $event->organizer_id !== $user->id
        ) {
            return response()->json([
                'message' => 'Anda hanya dapat mengubah event milik sendiri.'
            ], 403);
        }

        $validated = $request->validated(); // Memvalidasi data yang akan diubah

        $event->update($validated); // Memperbarui data event

        return response()->json([
            'message' => 'Event berhasil diperbarui',
            'data' => new EventResource($event)
        ], 200);
    }

    public function destroy(Request $request, string $id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Event tidak ditemukan'
            ], 404);
        }

        $user = $request->user();

        if (
            $user->role === 'organizer' &&
            $event->organizer_id !== $user->id
        ) {
            return response()->json([
                'message' => 'Anda hanya dapat menghapus event milik sendiri.'
            ], 403);
        }

        $hasPendingBooking = DB::transaction(function () use ($event) {
            $tickets = Ticket::withTrashed()
                ->where('event_id', $event->id)
                ->lockForUpdate()
                ->get();

            $ticketIds = $tickets->pluck('id');

            $hasPendingBooking = Booking::whereIn('ticket_id', $ticketIds)
                ->where('status', 'pending')
                ->exists();

            if ($hasPendingBooking) {
                return true;
            }

            $event->delete();

            $tickets->each(function ($ticket) {
                if (!$ticket->trashed()) {
                    $ticket->delete();
                }
            });

            return false;
        });

        if ($hasPendingBooking) {
            return response()->json([
                'message' => 'Event tidak dapat dihapus karena masih memiliki booking pending.'
            ], 422);
        }

        return response()->json([
            'message' => 'Event dan tiket terkait berhasil dihapus'
        ], 200);
    }

    public function restore(Request $request, string $id)
    {
        $event = Event::withTrashed()->find($id);

        if (!$event) {
            return response()->json([
                'message' => 'Event tidak ditemukan'
            ], 404);
        }

        if (!$event->trashed()) {
            return response()->json([
                'message' => 'Event tidak dalam kondisi terhapus'
            ], 422);
        }

        $user = $request->user();

        if (
            $user->role === 'organizer' &&
            $event->organizer_id !== $user->id
        ) {
            return response()->json([
                'message' => 'Anda hanya dapat memulihkan event milik sendiri.'
            ], 403);
        }

        DB::transaction(function () use ($event) {
            $tickets = Ticket::withTrashed()
                ->where('event_id', $event->id)
                ->lockForUpdate()
                ->get();

            $event->restore();

            $tickets->each(function ($ticket) {
                if ($ticket->trashed()) {
                    $ticket->restore();
                }
            });
        });

        return response()->json([
            'message' => 'Event dan tiket terkait berhasil dipulihkan',
            'data' => new EventResource($event)
        ], 200);
    }
}