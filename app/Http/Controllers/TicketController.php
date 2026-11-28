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

        $this->authorizeEventManagement($request, $event);

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

        return DB::transaction(function () use ($data, $ticket, $request) {
            $lockedTicket = Ticket::where('id', $ticket->id)
                ->lockForUpdate()
                ->firstOrFail();

            $lockedTicket->load('event');

            $this->authorizeEventManagement(
                $request,
                $lockedTicket->event
            );

            if (isset($data['event_id'])) {
                $targetEvent = Event::findOrFail($data['event_id']);

                $this->authorize('create', [Ticket::class, $targetEvent]);
            }

            $lockedTicket->fill($data);

            if (
                isset($data['quota']) &&
                !$lockedTicket->validateQuota((int) $data['quota'])
            ) {
                return response()->json([
                    'message' => 'Kuota tidak boleh lebih kecil dari jumlah tiket terjual.'
                ], 422);
            }

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

    public function destroy(Request $request, Ticket $ticket)
    {
        $ticket->load('event');

        $this->authorizeEventManagement(
            $request,
            $ticket->event
        );

        $ticket->delete();

        return response()->json([
            'message' => 'Ticket berhasil dihapus.'
        ]);
    }

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

    public function restore($id)
    {
        $ticket = Ticket::withTrashed()
            ->with('event')
            ->findOrFail($id);

        $this->authorize('restore', $ticket);

        if (!$ticket->validateLabel($ticket->label)) {
            return response()->json([
                'message' => 'Tiket tidak dapat dipulihkan karena label sudah digunakan pada event ini.'
            ], 422);
        }

        $ticket->restore();

        return response()->json([
            'message' => 'Ticket berhasil dipulihkan.',
            'data' => new TicketResource($ticket->fresh()->load('event'))
        ]);
    }
}
