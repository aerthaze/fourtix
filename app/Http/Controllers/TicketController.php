<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Event;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Http\Resources\TicketResource;
use Illuminate\Support\Facades\DB;

class TicketController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Ticket::class);

        $tickets = Ticket::with('event')->get();

        return TicketResource::collection($tickets);
    }

    public function store(StoreTicketRequest $request)
    {
        $data = $request->validated();

        $event = Event::findOrFail($data['event_id']);
        $this->authorize('create', [Ticket::class, $event]);

        $ticket = new Ticket($data);
        $ticket->sold = 0;

        if (!$ticket->validateQuota($data['quota'])) {
            return response()->json([
                'message' => 'Kuota tiket tidak valid.'
            ], 422);
        }

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

    public function show(Ticket $ticket)
    {
        $this->authorize('view', $ticket);

        return new TicketResource($ticket->load('event'));
    }

    public function update(UpdateTicketRequest $request, Ticket $ticket)
    {
        $data = $request->validated();

        return DB::transaction(function () use ($data, $ticket) {
            $lockedTicket = Ticket::whereKey($ticket->id)
                ->lockForUpdate()
                ->firstOrFail();

            $lockedTicket->load('event');

            $this->authorize('update', $lockedTicket);

            if (isset($data['event_id'])) {
                $targetEvent = Event::findOrFail($data['event_id']);

                $this->authorize('create', [Ticket::class, $targetEvent]);
            }

            if (
                isset($data['quota']) &&
                !$lockedTicket->validateQuota((int) $data['quota'])
            ) {
                return response()->json([
                    'message' => 'Kuota tidak boleh lebih kecil dari jumlah tiket terjual.'
                ], 422);
            }

            $lockedTicket->fill($data);

            if (
                isset($data['label']) &&
                !$lockedTicket->validateLabel($data['label'])
            ) {
                return response()->json([
                    'message' => 'Label tiket sudah digunakan pada event ini.'
                ], 422);
            }

            $lockedTicket->save();

            return new TicketResource($lockedTicket->load('event'));
        });
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->load('event');

        $this->authorize('delete', $ticket);

        $ticket->delete();

        return response()->json([
            'message' => 'Ticket berhasil dihapus.'
        ]);
    }
}
