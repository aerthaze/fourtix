<?php

return [
    'payment_ttl_minutes' => (int) env('FOURTIX_PAYMENT_TTL_MINUTES', 15),

    'max_tickets_per_event' => (int) env('FOURTIX_MAX_TICKETS_PER_EVENT', 4),
];
