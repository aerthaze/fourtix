<?php
namespace App\Contracts;
use App\Models\Ticket;
interface Reservable
{
    public function reserveSeat(Ticket $ticket, int $quantity): bool;
}