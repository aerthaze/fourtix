<?php


use App\Http\Controllers\BookingController;

use App\Http\Controllers\Api\VenueController;
use App\Http\Controllers\AuthController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{booking}', [BookingController::class, 'show']);
    Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);

    
    Route::get('/venues', [VenueController::class, 'index']);
    Route::post('/venues', [VenueController::class, 'store']);
    Route::get('/venues/{venue}', [VenueController::class, 'show']);
    Route::put('/venues/{venue}', [VenueController::class, 'update']);
    Route::delete('/venues/{venue}', [VenueController::class, 'destroy']);

});
