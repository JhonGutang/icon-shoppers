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
        Schema::table('products', function (Blueprint $table) {
            $table->string('slug')->unique()->nullable()->after('name');
            $table->integer('sales_count')->default(0)->after('price');
            $table->string('sku')->nullable()->after('sales_count');
            $table->integer('stock')->default(0)->after('sku');
            $table->enum('status', ['published', 'draft'])->default('published')->after('is_visible');
            $table->unsignedBigInteger('category_id')->nullable()->after('shop_id');

            $table->index('slug');
            $table->index('status');
            $table->index('category_id');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropIndex(['slug']);
            $table->dropIndex(['status']);
            $table->dropIndex(['category_id']);
            $table->dropColumn(['slug', 'sales_count', 'sku', 'stock', 'status', 'category_id']);
        });
    }
};
