<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Event;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Venue;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

/** Jalankan dengan MySQL (phpunit.xml), bukan SQLite. */
class BookingFlowTest extends TestCase
{
    use RefreshDatabase;

    private function makeTicket(int $quota = 10): Ticket
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $venue = Venue::forceCreate(['name' => 'V', 'address' => 'A', 'city' => 'C']);
        $event = Event::forceCreate([
            'venue_id' => $venue->id,
            'organizer_id' => $organizer->id,
            'title' => 'T',
            'type' => 'concert',
            'event_date' => now()->addDays(7),
        ]);

        return Ticket::forceCreate([
            'event_id' => $event->id,
            'label' => 'VIP',
            'price' => 100000,
            'quota' => $quota,
            'sold' => 0,
        ]);
    }

    private function customer(): User
    {
        return tap(User::factory()->create(['role' => 'customer']), fn($u) => Sanctum::actingAs($u));
    }

    private function book(Ticket $t, int $qty = 1, string $key = 'k1')
    {
        return $this->withHeaders(['Idempotency-Key' => $key])
            ->postJson('/api/bookings', ['ticket_id' => $t->id, 'quantity' => $qty]);
    }

    public function test_hanya_customer_yang_bisa_booking(): void
    {
        $t = $this->makeTicket();
        Sanctum::actingAs(User::factory()->create(['role' => 'organizer']));

        $this->book($t)->assertForbidden();
    }

    public function test_header_idempotency_wajib(): void
    {
        $t = $this->makeTicket();
        $this->customer();

        $this->postJson('/api/bookings', ['ticket_id' => $t->id, 'quantity' => 1])->assertStatus(422);
    }

    public function test_idempotency_sama_mengembalikan_booking_yang_sama(): void
    {
        $t = $this->makeTicket();
        $this->customer();

        $a = $this->book($t, 2)->assertCreated()->json('data.id');
        $b = $this->book($t, 2)->assertOk()->json('data.id');

        $this->assertSame($a, $b);
        $this->assertSame(2, $t->fresh()->sold);
    }

    public function test_idempotency_isi_berbeda_ditolak(): void
    {
        $t = $this->makeTicket();
        $this->customer();

        $this->book($t, 1)->assertCreated();
        $this->book($t, 2)->assertStatus(409);
    }

    public function test_batas_pembelian_per_event(): void
    {
        $t = $this->makeTicket();
        $this->customer();

        $this->book($t, 5)->assertStatus(422);
    }

    public function test_pay_mengubah_pending_menjadi_paid(): void
    {
        $t = $this->makeTicket();
        $this->customer();
        $id = $this->book($t)->json('data.id');

        $this->postJson("/api/bookings/{$id}/pay")->assertOk()->assertJsonPath('data.status', 'paid');
    }

    public function test_booking_paid_tidak_bisa_dibatalkan(): void
    {
        $t = $this->makeTicket();
        $this->customer();
        $id = $this->book($t)->json('data.id');

        $this->postJson("/api/bookings/{$id}/pay")->assertOk();
        $this->postJson("/api/bookings/{$id}/cancel")->assertStatus(409);
    }

    public function test_expired_mengembalikan_kuota_satu_kali(): void
    {
        $t = $this->makeTicket();
        $this->customer();
        $id = $this->book($t, 2)->json('data.id');

        Booking::whereKey($id)->update(['expires_at' => now()->subMinute()]);

        $this->postJson("/api/bookings/{$id}/pay")->assertStatus(409);
        $this->assertSame('expired', Booking::find($id)->status);
        $this->assertSame(0, $t->fresh()->sold);

        $this->postJson("/api/bookings/{$id}/pay")->assertStatus(409);
        $this->assertSame(0, $t->fresh()->sold);
    }

    public function test_customer_tidak_bisa_melihat_booking_user_lain(): void
    {
        $t = $this->makeTicket();
        $this->customer();
        $id = $this->book($t)->json('data.id');

        Sanctum::actingAs(User::factory()->create(['role' => 'customer']));
        $this->getJson("/api/bookings/{$id}")->assertForbidden();
    }
}
