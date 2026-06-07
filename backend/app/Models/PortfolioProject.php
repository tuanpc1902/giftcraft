<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PortfolioProject extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'client_name',
        'occasion',
        'industry',
        'quantity',
        'cover_image',
        'gallery_images',
        'description',
        'is_featured',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'gallery_images' => 'array',
            'is_featured' => 'boolean',
            'quantity' => 'integer',
            'sort_order' => 'integer',
        ];
    }
}
