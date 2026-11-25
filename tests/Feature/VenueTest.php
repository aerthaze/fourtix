<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Venue;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class VenueTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Schema::create('users', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('remember_token')->nullable();
            $table->string('role')->default('customer');
            $table->timestamps();
        });

        Schema::create('venues', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('address');
            $table->string('city');
            $table->softDeletes();
            $table->timestamps();
        });

        Schema::create('events', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('venue_id')->constrained()->restrictOnDelete();
            $table->dateTime('event_date');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('events');
        Schema::dropIfExists('venues');
        Schema::dropIfExists('users');

        parent::tearDown();
    }

    public function test_admin_can_create_update_and_soft_delete_a_venue(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)
            ->postJson('/api/venues', [
                'name' => 'Venue Lama',
                'address' => 'Jalan Lama',
                'city' => 'Jakarta',
            ])
            ->assertCreated();

        $venue = Venue::query()->firstOrFail();

        $this->patchJson("/api/venues/{$venue->id}", [
            'name' => 'Venue Baru',
        ])->assertOk();

        $this->deleteJson("/api/venues/{$venue->id}")
            ->assertOk();

        $this->assertSoftDeleted('venues', ['id' => $venue->id]);
    }

    public function test_organizer_and_customer_can_only_view_venues(): void
    {
        $venue = Venue::create([
            'name' => 'Venue',
            'address' => 'Jalan',
            'city' => 'Jakarta',
        ]);

        foreach (['organizer', 'customer'] as $role) {
            $user = User::factory()->create(['role' => $role]);

            $this->actingAs($user)
                ->getJson('/api/venues')
                ->assertOk();

            $this->postJson('/api/venues', [
                'name' => 'Venue Baru',
                'address' => 'Jalan Baru',
                'city' => 'Bandung',
            ])->assertForbidden();

            $this->patchJson("/api/venues/{$venue->id}", [
                'name' => 'Tidak Diizinkan',
            ])->assertForbidden();

            $this->deleteJson("/api/venues/{$venue->id}")
                ->assertForbidden();
        }
    }

    public function test_customer_cannot_see_soft_deleted_venue_but_admin_can_with_trashed(): void
    {
        $venue = Venue::create([
            'name' => 'Venue Terhapus',
            'address' => 'Jalan',
            'city' => 'Jakarta',
        ]);
        $venue->delete();

        $customer = User::factory()->create(['role' => 'customer']);
        $this->actingAs($customer)
            ->getJson('/api/venues')
            ->assertOk()
            ->assertJsonMissing(['name' => 'Venue Terhapus']);

        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin)
            ->getJson('/api/venues?with_trashed=1')
            ->assertOk()
            ->assertJsonFragment(['name' => 'Venue Terhapus'])
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'address', 'city', 'deleted_at'],
                ],
            ]);
    }

    public function test_venue_with_active_event_cannot_be_soft_deleted(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $venue = Venue::create([
            'name' => 'Venue Aktif',
            'address' => 'Jalan',
            'city' => 'Jakarta',
        ]);

        $venue->events()->create([
            'event_date' => now()->addDay(),
        ]);

        $this->actingAs($admin)
            ->deleteJson("/api/venues/{$venue->id}")
            ->assertStatus(409);

        $this->assertDatabaseHas('venues', [
            'id' => $venue->id,
            'deleted_at' => null,
        ]);
    }

    public function test_venue_without_active_event_can_be_soft_deleted(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $venue = Venue::create([
            'name' => 'Venue Lama',
            'address' => 'Jalan',
            'city' => 'Jakarta',
        ]);

        $event = $venue->events()->create([
            'event_date' => now()->subDay(),
        ]);
        $event->delete();

        $this->actingAs($admin)
            ->deleteJson("/api/venues/{$venue->id}")
            ->assertOk();

        $this->assertSoftDeleted('venues', ['id' => $venue->id]);
    }
}
