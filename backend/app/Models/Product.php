<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;
use Spatie\Activitylog\Support\LogOptions;
use Spatie\Activitylog\Models\Concerns\LogsActivity;

class Product extends Model
{
    use HasFactory, LogsActivity, Searchable, SoftDeletes;

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

    public function searchableAs(): string
    {
        return 'products';
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'sku' => $this->sku,
            'retail_price' => (int) $this->retail_price,
            'stock_status' => $this->stock_status,
            'is_customizable' => (bool) $this->is_customizable,
            'cover_image' => $this->images[0] ?? null,
            'category_id' => $this->category_id,
        ];
    }

    public function shouldBeSearchable(): bool
    {
        return (bool) $this->is_active && ! $this->trashed();
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
