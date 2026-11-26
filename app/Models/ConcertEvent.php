<?php

namespace App\Models;

use App\Contracts\Reservable;
use Illuminate\Support\Facades\DB;

class ConcertEvent extends Event implements Reservable
{
    // Menggunakan tabel events
    protected $table = 'events'; //digunakan untuk menentukan bahwa model ConcertEvent menggunakan tabel events di database.

    public function reserveSeat(Ticket $ticket, int $quantity): bool //mendefinisikan method reserveSeat yang menerima parameter $ticket (objek Ticket) dan $quantity (jumlah tiket yang ingin dipesan). Method ini mengembalikan nilai boolean (true atau false).
    {
        // Memastikan event merupakan jenis concert
        if ($this->type !== 'concert' || $quantity <= 0) { //memeriksa apakah jenis event adalah 'concert' dan jumlah tiket yang ingin dipesan lebih besar dari 0.
            return false; //menghentikan proses dan mengembalikan nilai false
        }

        return DB::transaction(function () use ($ticket, $quantity) { //menjalankan proses pemesanan dalam sebuah transaksi database.

            // Mengunci data tiket selama proses reservasi
            $ticketData = Ticket::where('id', $ticket->id) //mencari tiket yang memiliki ID sesuai dengan tiket yang dikirim ke method reserveSeat.
                ->lockForUpdate() //mengunci baris database agar transaksi lain tidak bisa mengubah baris yang sama secara bersamaan sampai transaksi selesai
                ->first(); //mengambil satu data pertama yang cocok dengan kondisi tersebut

            // Memastikan tiket tersedia dan milik event ini
            if (
                !$ticketData || //memeriksa apakah data tiket tidak ditemukan di database
                $ticketData->event_id != $this->id || //memeriksa apakah tiket tersebut benar-benar milik event yang sedang diproses
                !$ticketData->isAvailable($quantity) //memeriksa apakah jumlah tiket yang ingin dipesan masih tersedia
            ) {
                return false; //mengembalikan nilai false jika salah satu kondisi di atas terpenuhi
            }

            // Menambahkan jumlah tiket terjual
            $ticketData->sold += $quantity; //menambahkan jumlah tiket terjual dengan jumlah tiket yang dipesan
            $ticketData->save(); //menyimpan perubahan tersebut ke database

            return true; //mengembalikan nilai true jika reservasi tiket berhasil dilakukan
        });
    }
}