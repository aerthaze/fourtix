<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;

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
        // Memvalidasi data event yang dikirim
        $validated = $request->validated(); // Mengambil data yang sudah divalidasi berdasarkan aturan di StoreEventRequest

        // Menyimpan data event ke database
        $event = Event::create($validated); //Membuat data event baru berdasarkan data yang telah divalidasi, kemudian menyimpannya ke dalam tabel events di database
        // Mengembalikan response JSON
        return response()->json([ //Mengembalikan response JSON
            'message' => 'Event berhasil ditambahkan', //menampilkan pesan bahwa event berhasil ditambahkan ke database
            'data' => new EventResource($event) // Mengubah data event yang berhasil ditambahkan ke dalam format EventResource
        ], 201); //menunjukkan permintaan berhasil diproses dan data berhasil ditambahkan ke database
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
        $event = Event::find($id); //menggunakan metode find() untuk mencari data event berdasarkan ID yang diberikan. Jika data event ditemukan, maka akan disimpan dalam variabel $event, jika tidak ditemukan maka akan bernilai null

        // Memeriksa apakah event ditemukan
        if (!$event) { //memeriksa apakah data event ditemukan atau tidak. Jika tidak ditemukan, maka akan mengembalikan response JSON dengan status code 404 (Not Found) dan pesan bahwa event tidak ditemukan
            return response()->json([ //mengembalikan response JSON dengan status code 404 (Not Found) dan pesan bahwa event tidak ditemukan
                'message' => 'Event tidak ditemukan' //menampilkan pesan bahwa event tidak ditemukan di database
            ], 404); //berarti data yang dicari tidak ditemukan di database, sehingga mengembalikan response JSON dengan status code 404 (Not Found) 
        }

        // Memvalidasi data yang akan diubah
        $validated = $request->validated(); // Mengambil data yang sudah divalidasi berdasarkan aturan di UpdateEventRequest

        // Memperbarui data event
        $event->update($validated); //Memperbarui data event yang sudah ditemukan menggunakan data baru yang telah divalidasi, kemudian menyimpan perubahan tersebut ke dalam tabel events di database
        return response()->json([
            'message' => 'Event berhasil diperbarui',
            'data' => new EventResource($event) // Mengubah data event yang berhasil diperbarui menjadi format EventResource
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Mencari data event berdasarkan ID
        $event = Event::find($id);

        // Memeriksa apakah event ditemukan
        if (!$event) {
            return response()->json([
                'message' => 'Event tidak ditemukan'
            ], 404);
        }

        // Menghapus data event dari database
        $event->delete(); //menghapus data event yg sebelumnya ditemukan dari tabel events di database

        // Mengembalikan response JSON
        return response()->json([
            'message' => 'Event berhasil dihapus'
        ], 200);
    }
}
