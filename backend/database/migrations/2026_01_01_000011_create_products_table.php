<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->longText('description')->nullable();
            $table->text('short_description')->nullable();
            $table->decimal('retail_price', 12, 0); // VNĐ
            $table->json('b2b_price_tiers')->nullable(); // [{qty,price},...] 5 tiers
            $table->enum('stock_status', ['in_stock', 'out_of_stock', 'pre_order'])->default('in_stock');
            $table->integer('weight_grams')->default(0);
            $table->string('sku')->unique()->nullable();
            $table->json('images')->nullable(); // array of URLs
            $table->boolean('is_active')->default(true);
            $table->boolean('is_customizable')->default(false);
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->integer('version')->default(1); // optimistic locking
            $table->softDeletes();
            $table->timestamps();

            $table->index(['category_id', 'stock_status', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
