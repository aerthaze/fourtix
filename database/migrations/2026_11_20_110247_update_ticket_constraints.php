<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropForeign(['event_id']);

            $table->foreign('event_id')
                ->references('id')
                ->on('events')
                ->restrictOnDelete();
        });

        DB::statement("
            ALTER TABLE tickets
            ADD CONSTRAINT tickets_quota_check
            CHECK (quota >= 0)
        ");

        DB::statement("
            ALTER TABLE tickets
            ADD CONSTRAINT tickets_sold_check
            CHECK (sold >= 0)
        ");

        DB::statement("
            ALTER TABLE tickets
            ADD CONSTRAINT tickets_sold_quota_check
            CHECK (sold <= quota)
        ");
    }

    public function down(): void
    {
        DB::statement("
            ALTER TABLE tickets
            DROP CHECK tickets_quota_check
        ");

        DB::statement("
            ALTER TABLE tickets
            DROP CHECK tickets_sold_check
        ");

        DB::statement("
            ALTER TABLE tickets
            DROP CHECK tickets_sold_quota_check
        ");

        Schema::table('tickets', function (Blueprint $table) {
            $table->dropForeign(['event_id']);

            $table->foreign('event_id')
                ->references('id')
                ->on('events')
                ->cascadeOnDelete();
        });
    }
};
