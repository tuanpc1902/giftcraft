<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplierApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'tax_code',
        'contact_name',
        'phone',
        'email',
        'product_types',
        'has_vat_invoice',
        'min_order_quantity',
        'description',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'has_vat_invoice' => 'boolean',
            'min_order_quantity' => 'integer',
        ];
    }
}
