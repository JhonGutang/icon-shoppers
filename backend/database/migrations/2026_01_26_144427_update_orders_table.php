<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('order_number')->unique()->nullable()->after('id');
            $table->decimal('subtotal', 10, 2)->default(0)->after('total_amount');
            $table->decimal('shipping_fee', 10, 2)->default(0)->after('subtotal');
            $table->string('delivery_method')->nullable()->after('payment_method');
            
            // Update status column - drop and recreate with new enum values
            $table->dropColumn('status');
        });
        
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', [
                'ordered', 
                'approved', 
                'rejected', 
                'processing', 
                'delivering', 
                'delivered', 
                'received', 
                'completed', 
                'cancelled'
            ])->default('ordered')->after('shop_id');
            
            $table->index('order_number');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['order_number']);
            $table->dropIndex(['status']);
            $table->dropColumn(['order_number', 'subtotal', 'shipping_fee', 'delivery_method', 'status']);
        });
        
        Schema::table('orders', function (Blueprint $table) {
            $table->string('status')->default('PENDING');
        });
    }
};
