<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('b2b_quotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $table->string('company_name');
            $table->string('contact_name');
            $table->string('phone');
            $table->string('email');
            $table->string('occasion');
            $table->integer('quantity_requested');
            $table->string('tier_matched')->nullable();
            $table->decimal('budget_min', 12, 0)->nullable();
            $table->decimal('budget_max', 12, 0)->nullable();
            $table->date('deadline')->nullable();
            $table->text('custom_requirements')->nullable();
            $table->string('brief_file_url')->nullable();
            $table->enum('status', ['new', 'contacted', 'quoted', 'won', 'lost'])->default('new');
            $table->decimal('quoted_price', 12, 0)->nullable();
            $table->text('sales_notes')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['status', 'assigned_to']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('b2b_quotes');
    }
};
