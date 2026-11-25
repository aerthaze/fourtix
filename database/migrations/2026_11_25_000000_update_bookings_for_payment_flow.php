<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->timestamp('expires_at')->nullable()->after('booking_code');
            $table->string('idempotency_key', 100)->nullable()->after('expires_at');
            $table->string('status', 20)->default('pending')->change();
        });

        // Booking lama: confirmed -> paid (expires_at lama boleh NULL)
        DB::table('bookings')->where('status', 'confirmed')->update(['status' => 'paid']);

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['ticket_id']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->restrictOnDelete();
            $table->foreign('ticket_id')->references('id')->on('tickets')->restrictOnDelete();

            // NULL boleh berulang di MySQL, jadi booking lama aman
            $table->unique(['user_id', 'idempotency_key']);
            $table->index(['status', 'expires_at']);
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['ticket_id']);
        });

        Schema::table('bookings', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'idempotency_key']);
            $table->dropIndex(['status', 'expires_at']);
            $table->dropColumn(['expires_at', 'idempotency_key']);
            $table->string('status', 20)->default('confirmed')->change();
        });

        DB::table('bookings')->where('status', 'paid')->update(['status' => 'confirmed']);

        Schema::table('bookings', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('ticket_id')->references('id')->on('tickets')->cascadeOnDelete();
        });
    }
};
