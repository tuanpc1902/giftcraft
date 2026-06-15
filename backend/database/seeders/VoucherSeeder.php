<?php

namespace Database\Seeders;

use App\Models\Voucher;
use Illuminate\Database\Seeder;

class VoucherSeeder extends Seeder
{
    public function run(): void
    {
        $vouchers = [
            [
                'code'             => 'WELCOME10',
                'type'             => 'percent',
                'value'            => 10,
                'min_order_amount' => 200000,
                'max_discount'     => 100000,
                'usage_limit'      => 500,
                'expires_at'       => now()->addYear(),
            ],
            [
                'code'             => 'TET2025',
                'type'             => 'percent',
                'value'            => 15,
                'min_order_amount' => 500000,
                'max_discount'     => 200000,
                'usage_limit'      => 200,
                'expires_at'       => '2026-02-15',
            ],
            [
                'code'             => 'GIAM50K',
                'type'             => 'fixed',
                'value'            => 50000,
                'min_order_amount' => 300000,
                'max_discount'     => null,
                'usage_limit'      => 1000,
                'expires_at'       => now()->addMonths(6),
            ],
            [
                'code'             => 'B2B20',
                'type'             => 'percent',
                'value'            => 20,
                'min_order_amount' => 5000000,
                'max_discount'     => 1000000,
                'usage_limit'      => 50,
                'expires_at'       => now()->addYear(),
            ],
            [
                'code'             => 'FREESHIP',
                'type'             => 'fixed',
                'value'            => 30000,
                'min_order_amount' => 100000,
                'max_discount'     => null,
                'usage_limit'      => 2000,
                'expires_at'       => now()->addMonths(3),
            ],
        ];

        foreach ($vouchers as $v) {
            Voucher::updateOrCreate(
                ['code' => $v['code']],
                array_merge($v, ['used_count' => 0])
            );
        }
    }
}
