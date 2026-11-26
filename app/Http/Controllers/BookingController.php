<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Ticket;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class BookingController extends Controller
{
    public function __construct(private readonly BookingService $bookingService) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $user  = $request->user();
        $query = Booking::with('ticket.event')->latest();

        if ($user->role === 'organizer') {
            // hanya booking event miliknya, termasuk event/ticket yang sudah dihapus.
            // Pakai DB::table supaya tetap jalan 
            $eventIds  = DB::table('events')->where('organizer_id', $user->id)->select('id');
            $ticketIds = Ticket::withTrashed()->whereIn('event_id', $eventIds)->select('id');

            $query->whereIn('ticket_id', $ticketIds);
        } elseif ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        return BookingResource::collection($query->paginate(10));
    }

    public function store(StoreBookingRequest $request): JsonResponse
    {
        $key = $request->header('Idempotency-Key') ?? $request->input('idempotency_key');

        if (! filled($key)) {
            return response()->json([
                'message' => 'Header Idempotency-Key wajib diisi.',
            ], 422);
        }

        [$booking, $created] = $this->bookingService->create(
            $request->user(),
            $request->validated(),
            (string) $key,
        );

        return (new BookingResource($booking))
            ->response()
            ->setStatusCode($created ? 201 : 200);
    }

    public function show(Booking $booking): BookingResource
    {
        Gate::authorize('view', $booking);

        return new BookingResource($booking->load('ticket.event'));
    }

    public function pay(Booking $booking): BookingResource
    {
        Gate::authorize('pay', $booking);

        return new BookingResource($this->bookingService->pay($booking));
    }

    public function cancel(Booking $booking): BookingResource
    {
        Gate::authorize('cancel', $booking);

        return new BookingResource($this->bookingService->cancel($booking));
    }
}
