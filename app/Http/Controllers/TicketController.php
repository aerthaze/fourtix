<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Http\Resources\TicketResource;

class TicketController extends Controller
{
    // Menampilkan semua tiket
    public function index()
    {
        $tickets = Ticket::with('event')->get();

        return TicketResource::collection($tickets);
    }

    // Menambahkan tiket
    public function store(StoreTicketRequest $request)
    {
        $data = $request->validated();

        $ticket = new Ticket($data);

        // Memeriksa kuota
        if (!$ticket->validateQuota($data['quota'])) {
            return response()->json([
                'message' => 'Kuota tiket tidak valid.'
            ], 422);
        }

        // Memeriksa label duplikat
        if (!$ticket->validateLabel($data['label'])) {
            return response()->json([
                'message' => 'Label tiket sudah digunakan pada event ini.'
            ], 422);
        }

        $ticket->save();

        return (new TicketResource($ticket))
            ->response()
            ->setStatusCode(201);
    }

    // Menampilkan detail tiket
    public function show(Ticket $ticket)
    {
        return new TicketResource($ticket->load('event'));
    }

    // Memperbarui tiket
    public function update(UpdateTicketRequest $request, Ticket $ticket)
    {
        $data = $request->validated();

        // Terapkan perubahan sementara untuk pemeriksaan label
        $ticket->fill($data);

        // Memeriksa kuota baru
        if (
            isset($data['quota']) &&
            !$ticket->validateQuota($data['quota'])
        ) {
            return response()->json([
                'message' => 'Kuota tidak boleh lebih kecil dari jumlah tiket terjual.'
            ], 422);
        }

        // Memeriksa label duplikat
        if (
            isset($data['label']) &&
            !$ticket->validateLabel($data['label'])
        ) {
            return response()->json([
                'message' => 'Label tiket sudah digunakan pada event ini.'
            ], 422);
        }

        $ticket->save();

        return new TicketResource($ticket);
    }

    // Menghapus tiket
    public function destroy(Ticket $ticket)
    {
        // Memeriksa riwayat booking
        if (!$ticket->canBeDeleted()) {
            return response()->json([
                'message' => 'Tiket tidak dapat dihapus karena memiliki riwayat booking.'
            ], 422);
        }

        $ticket->delete();

        return response()->json([
            'message' => 'Ticket berhasil dihapus.'
        ]);
    }
}
