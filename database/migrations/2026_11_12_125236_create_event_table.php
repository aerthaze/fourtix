<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) { // Membuat tabel events
            $table->id(); //membuat kolom id sebagai primary key
            $table->foreignId('venue_id')->constrained()->restrictOnDelete();
            $table->string('title'); //menyimpan title acara (event)
            $table->enum('type', ['cinema', 'concert']); //menyimpan jenis acara (event) yang hanya bisa diisi dengan 'cinema' atau 'concert'
            $table->dateTime('event_date'); //menyimpan tanggal dan waktu acara berlangsung
            $table->string('studio')->nullable(); //menyimpan nama studio tempat acara diselenggarakan dan bisa bernilai null(kosong) jika tidak ada studio yang ditentukan misalnya untuk acara konser

            $table->timestamps(); //membuat kolom created_at dan updated_at untuk mencatat waktu pembuatan dan pembaruan data
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
