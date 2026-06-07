<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@giftcraft.vn'],
            [
                'name' => 'GiftCraft Admin',
                'password' => Hash::make('Admin@123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        User::updateOrCreate(
            ['email' => 'sales@giftcraft.vn'],
            [
                'name' => 'GiftCraft Sales B2B',
                'password' => Hash::make('Sales@123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
    }
}
