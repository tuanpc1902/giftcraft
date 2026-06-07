<?php

namespace App\Services;

use Illuminate\Support\Facades\Redis;

class OrderNumberService
{
    /**
     * Generate a unique order number: GC-YYYYMMDD-XXXXX
     * Uses an atomic Redis INCR per-day counter to avoid duplicates under concurrency.
     */
    public function generate(): string
    {
        $date = now()->format('Ymd');
        $key = "order_seq:{$date}";

        $seq = Redis::incr($key);

        // Expire the counter ~48h after creation so old keys clean themselves up.
        if ((int) $seq === 1) {
            Redis::expire($key, 60 * 60 * 48);
        }

        return sprintf('GC-%s-%05d', $date, $seq);
    }
}
