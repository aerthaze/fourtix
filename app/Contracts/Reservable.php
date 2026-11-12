<?php
namespace App\Contracts;
interface Reservable
{
    public function reserveSeat(int $quantity): bool;
}
