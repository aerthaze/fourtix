<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BookingController extends Controller
{
    public function __construct(private readonly BookingService $bookingService) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $bookings = Booking::with('ticket.event')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return BookingResource::collection($bookings);
    }

    public function store(StoreBookingRequest $request): JsonResponse
    {
        $booking = $this->bookingService->createBooking($request->user(), $request->validated());

        return (new BookingResource($booking))->response()->setStatusCode(201);
    }

    public function show(Request $request, Booking $booking): BookingResource
    {
        abort_if($booking->user_id !== $request->user()->id, 403, 'Bukan booking milikmu.');

        return new BookingResource($booking->load('ticket.event'));
    }

    public function cancel(Request $request, Booking $booking): BookingResource
    {
        abort_if($booking->user_id !== $request->user()->id, 403, 'Bukan booking milikmu.');

        return new BookingResource($this->bookingService->cancelBooking($booking));
    }
}
