<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('supplier_applications', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');
            $table->string('tax_code');
            $table->string('contact_name');
            $table->string('phone');
            $table->string('email');
            $table->text('product_types');
            $table->boolean('has_vat_invoice')->default(false);
            $table->integer('min_order_quantity')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['new', 'reviewing', 'approved', 'rejected'])->default('new');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('supplier_applications');
    }
};
