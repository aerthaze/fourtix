<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminOrganizerSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'name' => 'Farras',
                'email' => 'admin@fourtix.id',
                'password' => 'password123',
                'role' => 'admin',
            ],
            [
                'name' => 'Nabila EO',
                'email' => 'nabila@fourtix.id',
                'password' => 'password123',
                'role' => 'organizer',
            ],
            [
                'name' => 'Novi EO',
                'email' => 'novi@fourtix.id',
                'password' => 'password123',
                'role' => 'organizer',
            ],
            [
                'name' => 'Nova Amelia',
                'email' => 'nova@test.com',
                'password' => 'password123',
                'role' => 'customer',
            ],
            [
                'name' => 'Marcello',
                'email' => 'marcello@test.com',
                'password' => 'password123',
                'role' => 'customer',
            ],
        ];

        foreach ($accounts as $account) {
            $user = User::firstOrNew([
                'email' => $account['email'],
            ]);

            $user->name = $account['name'];
            $user->password = $account['password'];
            $user->role = $account['role'];
            $user->save();
        }
    }
}
