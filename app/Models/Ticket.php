<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'event_id',
        'label',
        'price',
        'quota',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'quota' => 'integer',
            'sold' => 'integer',
        ];
    }

    // Relasi Ticket dengan Event
    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    // Relasi Ticket dengan Booking
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    // Menghitung sisa tiket
    public function remaining(): int
    {
        return max(0, $this->quota - $this->sold);
    }

    // Memeriksa ketersediaan tiket
    public function isAvailable(int $quantity = 1): bool
    {
        return $quantity > 0
            && $this->remaining() >= $quantity;
    }

    // Memeriksa apakah kuota baru valid
    public function validateQuota(int $newQuota): bool
    {
        return $newQuota >= $this->sold
            && $newQuota >= 0;
    }

    // Memeriksa apakah label tiket belum digunakan
    public function validateLabel(string $label): bool
    {
        return !self::where('event_id', $this->event_id)
            ->where('label', $label)
            ->when($this->exists, function ($query) {
                $query->where('id', '!=', $this->id);
            })
            ->exists();
    }

    // Memperbarui harga tiket
    public function updatePrice(float $newPrice): bool
    {
        if ($newPrice < 0) {
            return false;
        }

        $this->price = $newPrice;

        return $this->save();
    }

    // Memeriksa apakah tiket sudah habis
    public function markAsSoldOut(): bool
    {
        return $this->remaining() <= 0;
    }
}
