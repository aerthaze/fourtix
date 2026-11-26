<?php

namespace App\Models;

use App\Traits\GeneratesBookingCode;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    use GeneratesBookingCode;

    public const STATUS_PENDING   = 'pending';
    public const STATUS_PAID      = 'paid';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_EXPIRED   = 'expired';

    protected $fillable = [
        'user_id',
        'ticket_id',
        'quantity',
        'total_price',
        'status',
        'booking_code',
        'expires_at',
        'paid_at',
        'cancelled_at',
        'idempotency_key',
    ];

    protected function casts(): array
    {
        return [
            'quantity'    => 'integer',
            'total_price' => 'decimal:2',
            'expires_at'   => 'datetime',
            'paid_at'      => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Booking $booking) {
            $booking->booking_code ??= $booking->generateBookingCode();
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // withTrashed: riwayat booking tetap tampil walau ticket sudah di-soft-delete
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class)->withTrashed();
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isPaid(): bool
    {
        return $this->status === self::STATUS_PAID;
    }

    public function isCancelled(): bool
    {
        return $this->status === self::STATUS_CANCELLED;
    }

    public function isExpired(): bool
    {
        return $this->status === self::STATUS_EXPIRED;
    }

    // Pending dan sudah lewat batas waktu bayar
    public function hasExpired(): bool
    {
        return $this->isPending()
            && $this->expires_at !== null
            && $this->expires_at->isPast();
    }
}