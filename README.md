<div align="center">

<img src="https://cdn.droptocdn.com/files/80a74436-572c-44c4-973e-fdd3a02716cd/fortikmantap.png" alt="Fourtix Logo" width="200">

# FOURTIX

**Event & Cinema Ticketing Backend API**

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Kelompok](https://img.shields.io/badge/Kelompok-4-orange)
![Laravel](https://img.shields.io/badge/Laravel-13-FF2D20?logo=laravel)
![PHP](https://img.shields.io/badge/PHP-8.5-777BB4?logo=php)
[![GitHub](https://img.shields.io/badge/repo-aerthaze/fourtix-blue?logo=github)](https://github.com/aerthaze/fourtix)

</div>

---

## Deskripsi

FOURTIX adalah REST API pemesanan tiket bioskop dan konser yang dibangun dengan Laravel 13 dan PHP 8.5, terinspirasi dari alur TIX ID dan Loket.com. Sistem ini menyatukan pemesanan kursi bioskop dan kuota zona konser melalui satu kontrak `Reservable`, sekaligus menjaga integritas data dengan transaksi database, penguncian baris, idempotency, dan pembatasan akses. Tersedia pula antarmuka web sederhana sebagai konsumen API dan media demonstrasi.

## Fitur

- Autentikasi token Sanctum dengan tiga peran: admin, organizer, customer
- CRUD Venue, Event (cinema/concert), dan Ticket
- Siklus booking: `pending → paid / cancelled / expired`
- `Idempotency-Key` untuk mencegah booking ganda
- Transaksi + `lockForUpdate()` dengan urutan kunci yang konsisten
- CHECK constraint kuota dan pengembalian kuota saat batal/expired
- Soft delete pada venue, event, dan tiket dengan `withTrashed()`
- Form Request, API Resource, Policy, dan rate limiting pada endpoint auth
- Antarmuka web dengan mode Mock dan Live API

## Teknologi

Laravel 13.42.0 · PHP 8.5 · Sanctum 4 · MySQL/SQLite · Tailwind CSS · PHPUnit 12

## Menjalankan Proyek

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

Aplikasi: `http://127.0.0.1:8000` · API: `http://127.0.0.1:8000/api`

Untuk menjalankan server, queue, dan logsekaligus: `composer dev`.

## Konfigurasi

| Variabel | Nilai | Fungsi |
|---|---|---|
| `DB_CONNECTION` | `sqlite` | Driver database (bisa `mysql`) |
| `FOURTIX_PAYMENT_TTL_MINUTES` | `15` | Batas bayar booking pending |
| `FOURTIX_MAX_TICKETS_PER_EVENT` | `4` | Maksimal tiket per event per akun |
| `SEED_ADMIN_PASSWORD` | `password123` | Password akun admin hasil seeder |
| `SEED_ORGANIZER_PASSWORD` | `password123` | Password akun organizer hasil seeder |

Akun demo: `admin@fourtix.test`, `organizer.a@fourtix.test`, `organizer.b@fourtix.test` dengan password sesuai `.env`; customer `test@example.com` dengan password `password`.

## Endpoint API

- **Auth:** `POST /api/register`, `POST /api/login`, `POST /api/logout`, `GET /api/user`
- **Venue:** `GET|POST /api/venues`, `GET|PATCH|DELETE /api/venues/{id}`
- **Event:** `GET|POST /api/events`, `GET|PATCH|DELETE /api/events/{id}`, `PATCH /api/events/{id}/restore`
- **Ticket:** `GET|POST /api/tickets`, `GET|PATCH|DELETE /api/tickets/{id}`
- **Booking:** `GET|POST /api/bookings`, `GET /api/bookings/{id}`, `POST /api/bookings/{id}/pay`, `POST /api/bookings/{id}/cancel`

Header yang dipakai: `Accept: application/json`, `Authorization: Bearer <token>`, dan `Idempotency-Key` untuk `POST /api/bookings`.

Status respons: `200`, `201`, `401`, `403`, `404`, `409`, `422`, `429`.

## Hak Akses

- **Admin:** mengelola seluruh data dan melihat seluruh booking
- **Organizer:** mengelola event dan tiket milik sendiri, melihat booking eventnya
- **Customer:** melihat katalog dan mengelola booking milik sendiri

## Penerapan OOP

- `Reservable` — interface kontrak `reserveSeat()`
- `CinemaShow` dan `ConcertEvent` — turunan `Event`, dipanggil polimorfik oleh `BookingService`
- `GeneratesBookingCode` — trait pembuat kode `FTX-...`
- `BookingService` — service pattern, disuntikkan ke `BookingController`
- Encapsulation, Policy, Form Request, dan API Resource pada lapisan HTTP
- Antarmuka web juga memakai class JavaScript, field privat, dan factory method

## Alur Booking

1. `POST /api/bookings` dengan `Idempotency-Key`
2. Cek kunci: sama + payload sama → kembalikan booking lama; payload beda → `409`
3. Kunci tiket lalu user, cek event aktif dan batas 4 tiket
4. `resolveReservable()` memanggil `reserveSeat()` sesuai tipe event
5. Buat booking `pending` dengan `expires_at`, kuota bertambah
6. `pay()` → `paid`; `cancel()` atau lewat waktu → kuota dikembalikan

## Antarmuka Web

`public/index.html` dan `public/app.js`, disajikan Laravel di rute `/`. Mode **Mock** memakai data di browser; mode **Live** terhubung ke API dengan token Sanctum. Tersedia role switcher, generator Idempotency-Key, uji double-submit, dan countdown pembayaran.

## Pengujian

```bash
php artisan test
```

## Tautan

- Repository: https://github.com/aerthaze/fourtix
- Diagram UML & ERD: https://drive.google.com/file/d/1LSu5ozGlPwfjk4E1_fbBGYD-IDf1xNzk/view?usp=sharing
- Postman Collection: tersedia pada lampiran laporan teknis
