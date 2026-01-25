<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('shop_id')->constrained('shops')->onDelete('cascade');
            $table->decimal('total_amount', 10, 2);
            $table->string('status')->default('PENDING'); // PENDING, CONFIRMED, IN_TRANSIT, DELIVERED, COMPLETED, CANCELLED
            $table->string('payment_method')->default('cash_on_delivery'); // cash_on_delivery, online
            $table->string('payment_status')->default('pending'); // pending, paid, failed, refunded
            $table->text('shipping_address')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
