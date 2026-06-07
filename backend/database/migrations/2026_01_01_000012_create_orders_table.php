<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete(); // guest checkout
            $table->string('order_number')->unique();
            $table->enum('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->decimal('subtotal', 12, 0);
            $table->decimal('discount_amount', 12, 0)->default(0);
            $table->decimal('shipping_fee', 12, 0)->default(0);
            $table->decimal('total', 12, 0);
            $table->json('shipping_address'); // {name,phone,address,ward,district,city}
            $table->enum('delivery_type', ['standard', 'express'])->default('standard');
            $table->date('requested_delivery_date')->nullable();
            $table->text('gift_message')->nullable();      // lời nhắn thiệp
            $table->text('customer_note')->nullable();     // ghi chú tổng quát
            $table->enum('payment_method', ['cod', 'vnpay', 'momo'])->default('cod');
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->string('idempotency_key')->unique();
            $table->timestamp('paid_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['user_id', 'status', 'created_at']);
            $table->index('delivery_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
