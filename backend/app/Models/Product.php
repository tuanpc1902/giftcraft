<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Product extends Model
{
    use HasFactory, LogsActivity, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'short_description',
        'retail_price',
        'b2b_price_tiers',
        'stock_status',
        'weight_grams',
        'sku',
        'images',
        'is_active',
        'is_customizable',
        'category_id',
        'meta_title',
        'meta_description',
        'version',
    ];

    protected function casts(): array
    {
        return [
            'b2b_price_tiers' => 'array',
            'images' => 'array',
            'is_active' => 'boolean',
            'is_customizable' => 'boolean',
            'retail_price' => 'decimal:0',
            'weight_grams' => 'integer',
            'version' => 'integer',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'slug', 'retail_price', 'stock_status', 'is_active'])
            ->logOnlyDirty();
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
