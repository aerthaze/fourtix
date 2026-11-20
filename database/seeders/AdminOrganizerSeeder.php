<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use RuntimeException;

class AdminOrganizerSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'name' => env('ADMIN_NAME'),
                'email' => env('ADMIN_EMAIL'),
                'password' => env('ADMIN_PASSWORD'),
                'role' => 'admin',
            ],
            [
                'name' => env('ORGANIZER_NAME'),
                'email' => env('ORGANIZER_EMAIL'),
                'password' => env('ORGANIZER_PASSWORD'),
                'role' => 'organizer',
            ],
        ];

        foreach ($accounts as $account) {
            if (
                empty($account['name']) ||
                empty($account['email']) ||
                empty($account['password'])
            ) {
                throw new RuntimeException(
                    'Konfigurasi akun ' . $account['role'] .
                    ' belum lengkap di file .env'
                );
            }

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
