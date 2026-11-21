<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::all(); // Mengambil semua data event dari database

        return response()->json([ // Mengembalikan response JSON dengan status code 200 (OK)
            'message' => 'Daftar event berhasil diambil',
            'data' => EventResource::collection($events) // Mengubah semua data event menjadi format Resource sebelum dikirim dalam response JSON
        ], 200); //menunjukkan permintaan berhasil diproses dan data berhasil diambil dari database
    }

    /**
     * Store a newly created resource in storage.
     */
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

    /**
     * Display the specified resource.
     */
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

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventRequest $request, string $id)
    {
        // Mencari data event berdasarkan ID
        $event = Event::find($id);

        // Memeriksa apakah event ditemukan
        if (!$event) {
            return response()->json([
                'message' => 'Event tidak ditemukan'
            ], 404);
        }

        // Mengambil data pengguna yang sedang login
        $user = $request->user();

        // Memeriksa kepemilikan event
        if (
            $user->role === 'organizer' &&
            $event->organizer_id !== $user->id
        ) {
            return response()->json([
                'message' => 'Anda hanya dapat mengubah event milik sendiri.'
            ], 403);
        }

        // Memvalidasi data yang akan diubah
        $validated = $request->validated();

        // Memperbarui data event
        $event->update($validated);

        return response()->json([
            'message' => 'Event berhasil diperbarui',
            'data' => new EventResource($event)
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        // Mencari data event berdasarkan ID
        $event = Event::find($id);

        // Memeriksa apakah event ditemukan
        if (!$event) {
            return response()->json([
                'message' => 'Event tidak ditemukan'
            ], 404);
        }

        // Mengambil data pengguna yang sedang login
        $user = $request->user();

        // Memeriksa kepemilikan event
        if (
            $user->role === 'organizer' &&
            $event->organizer_id !== $user->id
        ) {
            return response()->json([
                'message' => 'Anda hanya dapat menghapus event milik sendiri.'
            ], 403);
        }

        // Menghapus data event dari database
        $event->delete();

        return response()->json([
            'message' => 'Event berhasil dihapus'
        ], 200);
    }
}