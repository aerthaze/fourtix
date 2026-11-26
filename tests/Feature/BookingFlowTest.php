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

class BookingFlowTest extends TestCase
{
    use RefreshDatabase;

    // Helper untuk menyiapkan data dummy (organizer, venue, event, dan tiket)
    private function makeTicket(int $quota = 10): Ticket
    {
        $organizer = User::factory()->create(['role' => 'organizer']);
        $venue = Venue::forceCreate(['name' => 'V', 'address' => 'A', 'city' => 'C']);
        $event = Event::forceCreate([
            'venue_id' => $venue->id, 'organizer_id' => $organizer->id,
            'title' => 'T', 'type' => 'concert', 'event_date' => now()->addDays(7),
        ]);

        return Ticket::forceCreate([
            'event_id' => $event->id, 'label' => 'VIP',
            'price' => 100000, 'quota' => $quota, 'sold' => 0,
        ]);
    }

    // Buat akun customer baru sekaligus login pakai Sanctum
    private function customer(): User
    {
        return tap(User::factory()->create(['role' => 'customer']), fn ($u) => Sanctum::actingAs($u));
    }

    // Helper request POST booking dengan header Idempotency-Key
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

    // Request ulang dengan key & isi sama tidak boleh bikin booking ganda atau mengurangi kuota lagi
    public function test_idempotency_sama_mengembalikan_booking_yang_sama(): void
    {
        $t = $this->makeTicket();
        $this->customer();

        $a = $this->book($t, 2)->assertCreated()->json('data.id');
        $b = $this->book($t, 2)->assertOk()->json('data.id');

        $this->assertSame($a, $b);
        $this->assertSame(2, $t->fresh()->sold);
    }

    // Key sama tapi payload berbeda harus ditolak (409 Conflict)
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
        $this->assertNotNull(Booking::find($id)->paid_at);
    }

    public function test_cancel_booking_pending_mengembalikan_kuota(): void
    {
        $t = $this->makeTicket();
        $this->customer();
        $id = $this->book($t, 2)->json('data.id');

        $this->postJson("/api/bookings/{$id}/cancel")->assertOk()->assertJsonPath('data.status', 'cancelled');
        $this->assertNotNull(Booking::find($id)->cancelled_at);
        $this->assertSame(0, $t->fresh()->sold);
    }

    // Jika sudah lewat batas bayar, status tetap di-commit jadi expired & kuota balik meski return 409
    public function test_cancel_pada_booking_expired_mengembalikan_kuota_dan_409(): void
    {
        $t = $this->makeTicket();
        $this->customer();
        $id = $this->book($t, 2)->json('data.id');
        Booking::whereKey($id)->update(['expires_at' => now()->subMinute()]);

        $this->postJson("/api/bookings/{$id}/cancel")->assertStatus(409);

        $this->assertSame('expired', Booking::find($id)->status);
        $this->assertSame(0, $t->fresh()->sold);
    }

    public function test_booking_ke_event_yang_dihapus_ditolak(): void
    {
        $t = $this->makeTicket();
        $this->customer();
        $t->event->delete();

        $this->book($t)->assertStatus(422);
    }

    // Pastikan relasi withTrashed() jalan agar riwayat booking lama tidak rusak saat event/tiket dihapus
    public function test_riwayat_booking_tetap_tampil_setelah_event_dan_ticket_dihapus(): void
    {
        $t = $this->makeTicket();
        $this->customer();
        $id = $this->book($t)->json('data.id');

        $t->event->delete();
        $t->delete();

        $this->getJson("/api/bookings/{$id}")
            ->assertOk()
            ->assertJsonPath('data.ticket.label', 'VIP');
    }

    public function test_booking_paid_tidak_bisa_dibatalkan(): void
    {
        $t = $this->makeTicket();
        $this->customer();
        $id = $this->book($t)->json('data.id');

        $this->postJson("/api/bookings/{$id}/pay")->assertOk();
        $this->postJson("/api/bookings/{$id}/cancel")->assertStatus(409);
    }

    // Cegah pengembalian kuota ganda (sold jadi minus) kalau booking expired dicoba bayar berkali-kali
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

    // Pastikan BookingPolicy memblokir customer mengintip booking milik user lain
    public function test_customer_tidak_bisa_melihat_booking_user_lain(): void
    {
        $t = $this->makeTicket();
        $this->customer();
        $id = $this->book($t)->json('data.id');

        Sanctum::actingAs(User::factory()->create(['role' => 'customer']));
        $this->getJson("/api/bookings/{$id}")->assertForbidden();
    }
}