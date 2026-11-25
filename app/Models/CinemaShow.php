<?php

namespace App\Models;

use App\Contracts\Reservable;
use Illuminate\Support\Facades\DB;

class CinemaShow extends Event implements Reservable
{
    protected $table = 'events'; //menentukan class CinemaShow menggunakan tabel events di database. Ini berarti bahwa data untuk model CinemaShow akan disimpan dalam tabel events, meskipun nama class berbeda. Dengan begitu, kita dapat menggunakan model ini untuk mengelola data pertunjukan bioskop (cinema show) yang disimpan dalam tabel events.

    public function reserveSeat(Ticket $ticket, int $quantity): bool //mendifinisikan method reserveSeat yang menerima parameter $ticket (objek Ticket) dan $quantity (jumlah tiket yang ingin dipesan). Method ini mengembalikan nilai boolean (true atau false) untuk menunjukkan apakah reservasi berhasil atau tidak.
    {
        if ($this->type !== 'cinema' || $quantity <= 0) { //memeriksa apakah jenis event adalah 'cinema' dan jumlah tiket yang ingin dipesan lebih besar dari 0. Jika tidak, maka reservasi tidak valid dan method akan mengembalikan false.
            return false; //menghentikan proses dan mengembalikan niai false
        }

        return DB::transaction(function () use ($ticket, $quantity) { //menjalankan proses pemessanan dalam sebuah tranasaksi database. Dengan menggunakan transaksi, jika terjadi kesalahan selama proses reservasi, semua perubahan yang dilakukan akan dibatalkan (rollback) sehingga data tetap konsisten. Fungsi anonim ini menggunakan $ticket dan $quantity dari konteks luar (use).

            $ticketData = Ticket::where('id', $ticket->id) //mencari tiket yang memiki ID sesuai dengan tiket yag dikirim ke method reserveSeat. Fungsi ini mengembalikan objek Ticket yang sesuai dengan ID yang diberikan.
                ->lockForUpdate() //mengunci baris database agar transaksi lain tidak bsa mengubah baris yang sama secara bersamaan sampai transaksi selesai
                ->first(); //mengambil satau data pertama yang cocok dengan kondisi trsebut

            if (
                !$ticketData || //apakah data tiket tidak ditemukan di database  atau
                $ticketData->event_id != $this->id || //apakah tiket tersebut beanr benar milik event yang sedang diproses atau
                !$ticketData->isAvailable($quantity) //memeriksa apakah jumlah tiket yang ingi dipesan masih tersedia jika
            ) {
                return false; //mengembalikan nilai false jika salah satu kondisi di atas terpenuhi, yang berarti reservasi tidak valid atau tidak dapat dilakukan.
            }

            $ticketData->sold += $quantity; //menambahkan jumlah tiket terjual engan jumlah tiket yang dipesan
            $ticketData->save(); //menyimpan perubahan terseut ke database

            return true; //mengemabliakkn hasil transaksi berhasil dan reservasi tiket berhasil dilakukan
        });
    }
}