<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVenueRequest;
use App\Http\Requests\UpdateVenueRequest;
use App\Http\Resources\VenueResource;
use App\Models\Venue;
use Illuminate\Http\JsonResponse;

class VenueController extends Controller
{
    // GET: /api/venues
    public function index()
    {
        return VenueResource::collection(Venue::latest()->paginate(10));
    }

    // POST: /api/venues
    public function store(StoreVenueRequest $request): JsonResponse
    {
        $venue = Venue::create($request->validated());

        return (new VenueResource($venue))
            ->response()
            ->setStatusCode(201);
    }

    // GET: /api/venues/{venue}
    public function show(Venue $venue): VenueResource
    {
        return new VenueResource($venue);
    }

    // PUT: /api/venues/{venue}
    public function update(UpdateVenueRequest $request, Venue $venue): VenueResource
    {
        $venue->update($request->validated());

        return new VenueResource($venue);
    }

    // DELETE: /api/venues/{venue}
    public function destroy(Venue $venue): JsonResponse
    {
        $venue->delete();

        return response()->json(['message' => 'Venue deleted successfully']);
    }
}