<?php
namespace App\Traits;
use Illuminate\Support\Str;
trait GeneratesBookingCode
{
    public function generateBookingCode(): string
    {
        return 'FTX-' . strtoupper(Str::random(10));
    }
}
