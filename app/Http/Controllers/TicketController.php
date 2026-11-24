<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Event;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Http\Resources\TicketResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        $event = Event::findOrFail($data['event_id']);

        // Memeriksa hak akses pengelolaan event
        $this->authorizeEventManagement($request, $event);

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

        return (new TicketResource($ticket->load('event')))
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

        return DB::transaction(function () use ($data, $ticket, $request) {

            // Mengunci data tiket selama proses pembaruan
            $lockedTicket = Ticket::where('id', $ticket->id)
                ->lockForUpdate()
                ->firstOrFail();

            $lockedTicket->load('event');

            // Memeriksa kepemilikan event saat ini
            $this->authorizeEventManagement(
                $request,
                $lockedTicket->event
            );

            // Memeriksa kepemilikan event tujuan jika event_id diubah
            if (isset($data['event_id'])) {
                $targetEvent = Event::findOrFail($data['event_id']);

                $this->authorizeEventManagement(
                    $request,
                    $targetEvent
                );
            }

            // Menerapkan perubahan sementara
            $lockedTicket->fill($data);

            // Memeriksa kuota baru
            if (
                isset($data['quota']) &&
                !$lockedTicket->validateQuota($data['quota'])
            ) {
                return response()->json([
                    'message' => 'Kuota tidak boleh lebih kecil dari jumlah tiket terjual.'
                ], 422);
            }

            // Memeriksa label duplikat
            if (
                isset($data['label']) &&
                !$lockedTicket->validateLabel($data['label'])
            ) {
                return response()->json([
                    'message' => 'Label tiket sudah digunakan pada event ini.'
                ], 422);
            }

            // Menyimpan perubahan
            $lockedTicket->save();

            return new TicketResource($lockedTicket->load('event'));
        });
    }

    // Menghapus tiket menggunakan Soft Delete
    public function destroy(Request $request, Ticket $ticket)
    {
        $ticket->load('event');

        // Memeriksa kepemilikan event
        $this->authorizeEventManagement(
            $request,
            $ticket->event
        );

        $ticket->delete();

        return response()->json([
            'message' => 'Ticket berhasil dihapus.'
        ]);
    }

    // Memeriksa hak akses admin dan organizer
    private function authorizeEventManagement(Request $request, Event $event)
    {
        $user = $request->user();

        $isAdmin = $user->role === 'admin';

        $isOwner = $user->role === 'organizer'
            && (int) $event->organizer_id === (int) $user->id;

        abort_unless(
            $isAdmin || $isOwner,
            403,
            'Anda tidak memiliki izin untuk mengelola tiket event ini.'
        );
    }
}
