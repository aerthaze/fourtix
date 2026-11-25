<?php

namespace App\Services;

use App\Contracts\Reservable;
use App\Exceptions\BookingException;
use App\Models\Booking;
use App\Models\CinemaShow;
use App\Models\ConcertEvent;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Facades\DB;

// Semua logika bisnis booking ada di sini.
// Controller hanya menerima request lalu memanggil class ini.
class BookingService
{
    // 1. BUAT BOOKING
    // Urutan lock: ticket -> user
    // Return: [booking, true jika baru dibuat / false jika request ulang]

    public function create(User $user, array $data, string $key): array
    {
        // Key yang sama sudah pernah dipakai? Kembalikan booking lama.
        $old = $this->findByKey($user, $key);

        if ($old) {
            return [$this->checkSameRequest($old, $data), false];
        }

        try {
            $booking = DB::transaction(fn() => $this->makeBooking($user, $data, $key));
        } catch (UniqueConstraintViolationException $e) {
            // Dua request dengan key sama masuk bersamaan.
            // Yang kalah mengambil booking milik yang menang.
            //  ditangkap DI LUAR transaction
            $old = $this->findByKey($user, $key);

            if (! $old) {
                throw $e;
            }

            return [$this->checkSameRequest($old, $data), false];
        }

        return [$booking, true];
    }

    private function makeBooking(User $user, array $data, string $key): Booking
    {
        $quantity = (int) $data['quantity'];

        // 1: kunci baris tiket
        $ticket = Ticket::whereKey($data['ticket_id'])->lockForUpdate()->first();
        $event  = $this->getActiveEvent($ticket);

        // 2: kunci baris user
        User::whereKey($user->id)->lockForUpdate()->firstOrFail();

        // 3: cek batas pembelian per event
        $this->checkPurchaseLimit($user, $ticket, $quantity);

        // 4: kurangi kuota. Cinema dan Concert dipanggil dengan cara yang sama
        // (polimorfisme), tapi aturan di dalamnya berbeda.
        $reserved = $this->resolveReservable($event)->reserveSeat($ticket, $quantity);

        if (! $reserved) {
            throw new BookingException('Kursi atau kuota tidak tersedia.', 409);
        }

        // Langkah 5: simpan booking (status pending + batas waktu bayar)
        return Booking::create([
            'user_id'         => $user->id,
            'ticket_id'       => $ticket->id,
            'quantity'        => $quantity,
            'total_price'     => $ticket->price * $quantity,
            'status'          => Booking::STATUS_PENDING,
            'expires_at'      => now()->addMinutes((int) config('fourtix.payment_ttl_minutes')),
            'idempotency_key' => $key,
        ])->load('ticket.event');
    }

    // 2. BAYAR (simulasi): pending -> paid
    // Urutan lock: booking -> ticket

    public function pay(Booking $booking): Booking
    {
        $expired = false;

        DB::transaction(function () use ($booking, &$expired) {
            $booking = Booking::whereKey($booking->id)->lockForUpdate()->firstOrFail();

            if (! $booking->isPending()) {
                throw new BookingException('Booking tidak menunggu pembayaran.', 409);
            }

            if ($booking->hasExpired()) {
                $this->markAsExpired($booking);
                $expired = true;

                return; // commit dulu, error dilempar setelah transaction
            }

            $booking->update(['status' => Booking::STATUS_PAID]);
        });

        if ($expired) {
            throw new BookingException('Batas waktu pembayaran sudah habis. Booking kedaluwarsa.', 409);
        }

        return $booking->fresh()->load('ticket.event');
    }

    // 3. BATALKAN: utk booking pending
    // Urutan lock: booking -> ticket

    public function cancel(Booking $booking): Booking
    {
        $expired = false;

        DB::transaction(function () use ($booking, &$expired) {
            $booking = Booking::whereKey($booking->id)->lockForUpdate()->firstOrFail();

            if ($booking->isPaid()) {
                throw new BookingException('Booking yang sudah dibayar tidak dapat dibatalkan.', 409);
            }

            if (! $booking->isPending()) {
                throw new BookingException('Booking tidak dapat dibatalkan.', 409);
            }

            if ($booking->hasExpired()) {
                $this->markAsExpired($booking);
                $expired = true;

                return;
            }

            $this->returnQuota($booking);
            $booking->update(['status' => Booking::STATUS_CANCELLED]);
        });

        if ($expired) {
            throw new BookingException('Booking sudah kedaluwarsa.', 409);
        }

        return $booking->fresh()->load('ticket.event');
    }

    // 4. EXPIRE: 
    // Return true jika benar-benar di-expire

    public function expireBooking(int $bookingId): bool
    {
        return DB::transaction(function () use ($bookingId) {
            $booking = Booking::whereKey($bookingId)->lockForUpdate()->first();

            if (! $booking || ! $booking->hasExpired()) {
                return false;
            }

            $this->markAsExpired($booking);

            return true;
        });
    }

    // Method bantu (private = hanya dipakai di class ini)

    // ubah status jadi expired dan kembalikan kuota (booking harus sudah dilock)
    private function markAsExpired(Booking $booking): void
    {
        $this->returnQuota($booking);
        $booking->update(['status' => Booking::STATUS_EXPIRED]);
    }

    // kembalikan kuota. withTrashed supaya tetap jalan walau ticket sudah dihapus.
    private function returnQuota(Booking $booking): void
    {
        $ticket = Ticket::withTrashed()->whereKey($booking->ticket_id)->lockForUpdate()->firstOrFail();
        $ticket->decrement('sold', $booking->quantity);
    }

    // ticket dan event harus ada, belum dihapus, dan belum lewat tanggalnya.
    // sengaja tanpa withTrashed.
    private function getActiveEvent(?Ticket $ticket): Event
    {
        if (! $ticket) {
            throw new BookingException('Tiket tidak tersedia.', 422);
        }

        $event = $ticket->event;

        if (! $event || filled($event->deleted_at)) {
            throw new BookingException('Event tidak tersedia.', 422);
        }

        if ($event->event_date->isPast()) {
            throw new BookingException('Event sudah berlalu.', 422);
        }

        return $event;
    }

    // hitung tiket pending + paid milik user di event ini
    private function checkPurchaseLimit(User $user, Ticket $ticket, int $quantity): void
    {
        $sudahDibeli = (int) Booking::where('user_id', $user->id)
            ->whereIn('status', [Booking::STATUS_PENDING, Booking::STATUS_PAID])
            ->whereHas('ticket', fn($q) => $q->withTrashed()->where('event_id', $ticket->event_id))
            ->sum('quantity');

        $max = (int) config('fourtix.max_tickets_per_event');

        if ($sudahDibeli + $quantity > $max) {
            throw new BookingException("Maksimal {$max} tiket per event untuk satu akun.", 422);
        }
    }

    private function findByKey(User $user, string $key): ?Booking
    {
        return Booking::where('user_id', $user->id)->where('idempotency_key', $key)->first();
    }

    // Key sama harus berisi permintaan yang sama
    private function checkSameRequest(Booking $old, array $data): Booking
    {
        $sama = (int) $old->ticket_id === (int) $data['ticket_id']
            && (int) $old->quantity === (int) $data['quantity'];

        if (! $sama) {
            throw new BookingException('Idempotency-Key sudah dipakai untuk permintaan yang berbeda.', 409);
        }

        return $old->load('ticket.event');
    }

    // Ubah Event biasa menjadi CinemaShow / ConcertEvent sesuai tipenya
    private function resolveReservable(Event $event): Reservable
    {
        return match ($event->type) {
            'cinema'  => CinemaShow::findOrFail($event->id),
            'concert' => ConcertEvent::findOrFail($event->id),
            default   => throw new BookingException('Tipe event tidak didukung.', 422),
        };
    }
}
