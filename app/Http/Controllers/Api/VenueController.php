<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVenueRequest;
use App\Http\Requests\UpdateVenueRequest;
use App\Http\Resources\VenueResource;
use App\Models\Venue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VenueController extends Controller
{
    // GET: /api/venues
    public function index(Request $request)
    {
        $this->authorize('viewAny', Venue::class);

        $venues = Venue::query();

        if ($request->boolean('with_trashed') && $request->user()->role === 'admin') {
            $venues = Venue::withTrashed();
        }

        return VenueResource::collection(
            $venues->latest()->paginate(10)
        );
    }

    // POST: /api/venues
    public function store(StoreVenueRequest $request): JsonResponse
    {
        $this->authorize('create', Venue::class);

        $venue = Venue::create($request->validated());

        return (new VenueResource($venue))
            ->response()
            ->setStatusCode(201);
    }

    // GET: /api/venues/{venue}
    public function show(Venue $venue): VenueResource
    {
        $this->authorize('view', $venue);

        return new VenueResource($venue);
    }

    // PATCH: /api/venues/{venue}
    public function update(UpdateVenueRequest $request, Venue $venue): VenueResource
    {
        $this->authorize('update', $venue);
        
        $venue->update($request->validated());

        return new VenueResource($venue);
    }

    // DELETE: /api/venues/{venue}
    public function destroy(Venue $venue): JsonResponse
    {
        $this->authorize('delete', $venue);

        if ($venue->events()->exists()) {
            return response()->json([
                'message' => 'Venue tidak dapat dihapus karena masih memiliki event aktif.',
            ], 409);
        }

        $venue->delete();

        return response()->json(['message' => 'Venue deleted successfully']);
    }
}