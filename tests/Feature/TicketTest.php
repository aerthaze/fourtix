<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Ticket;
use App\Models\User;
use App\Policies\TicketPolicy;

class TicketTest extends TestCase
{
    public function test_ticket_quota_cannot_be_less_than_sold(): void
    {
        $ticket = new Ticket([
            'quota' => 10,
        ]);

        $ticket->sold = 5;

        $this->assertFalse($ticket->validateQuota(4));
        $this->assertTrue($ticket->validateQuota(5));
        $this->assertTrue($ticket->validateQuota(10));
    }

    public function test_ticket_remaining_is_calculated_correctly(): void
    {
        $ticket = new Ticket([
            'quota' => 10,
        ]);

        $ticket->sold = 3;

        $this->assertEquals(7, $ticket->remaining());
        $this->assertTrue($ticket->isAvailable(7));
        $this->assertFalse($ticket->isAvailable(8));
    }

    public function test_ticket_is_sold_out_when_quota_is_fully_sold(): void
    {
        $ticket = new Ticket([
            'quota' => 10,
        ]);

        $ticket->sold = 10;

        $this->assertTrue($ticket->markAsSoldOut());
        $this->assertEquals(0, $ticket->remaining());
    }

    public function test_ticket_uses_soft_deletes(): void
    {
        $this->assertContains(
            \Illuminate\Database\Eloquent\SoftDeletes::class,
            class_uses_recursive(Ticket::class)
        );
    }

    public function test_admin_can_manage_tickets(): void
    {
        $admin = new User();
        $admin->role = 'admin';

        $ticket = new Ticket();
        $policy = new TicketPolicy();

        $this->assertTrue($policy->viewAny($admin));
        $this->assertTrue($policy->view($admin, $ticket));
        $this->assertTrue($policy->update($admin, $ticket));
        $this->assertTrue($policy->delete($admin, $ticket));
    }

    public function test_customer_can_only_view_tickets(): void
    {
        $customer = new User();
        $customer->role = 'customer';

        $ticket = new Ticket();
        $policy = new TicketPolicy();

        $this->assertTrue($policy->viewAny($customer));
        $this->assertTrue($policy->view($customer, $ticket));
        $this->assertFalse($policy->update($customer, $ticket));
        $this->assertFalse($policy->delete($customer, $ticket));
    }
}
