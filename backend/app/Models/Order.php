<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Order extends Model
{
    use HasFactory, LogsActivity, SoftDeletes;

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'subtotal',
        'discount_amount',
        'shipping_fee',
        'total',
        'shipping_address',
        'delivery_type',
        'requested_delivery_date',
        'gift_message',
        'customer_note',
        'payment_method',
        'payment_status',
        'idempotency_key',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'shipping_address' => 'array',
            'requested_delivery_date' => 'date',
            'paid_at' => 'datetime',
            'subtotal' => 'decimal:0',
            'discount_amount' => 'decimal:0',
            'shipping_fee' => 'decimal:0',
            'total' => 'decimal:0',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'payment_status', 'total'])
            ->logOnlyDirty();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
