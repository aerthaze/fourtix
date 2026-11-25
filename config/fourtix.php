<?php

return [
    // batas waktu pembayaran booking (menit)
    'payment_ttl_minutes' => (int) env('PAYMENT_TTL_MINUTES', 30),

    // maksimal tiket per event untuk satu akun (booking pending + paid)
    'max_tickets_per_event' => (int) env('MAX_TICKETS_PER_EVENT', 4),
];
