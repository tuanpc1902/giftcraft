<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class B2bQuote extends Model
{
    use HasFactory, LogsActivity, SoftDeletes;

    protected $table = 'b2b_quotes';

    protected $fillable = [
        'user_id',
        'product_id',
        'company_name',
        'contact_name',
        'phone',
        'email',
        'occasion',
        'quantity_requested',
        'tier_matched',
        'budget_min',
        'budget_max',
        'deadline',
        'custom_requirements',
        'brief_file_url',
        'status',
        'quoted_price',
        'sales_notes',
        'admin_note',
        'assigned_to',
    ];

    protected function casts(): array
    {
        return [
            'deadline' => 'date',
            'quantity_requested' => 'integer',
            'budget_min' => 'decimal:0',
            'budget_max' => 'decimal:0',
            'quoted_price' => 'decimal:0',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'quoted_price', 'assigned_to'])
            ->logOnlyDirty();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
