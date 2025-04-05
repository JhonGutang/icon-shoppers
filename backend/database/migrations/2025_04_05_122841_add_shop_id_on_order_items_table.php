<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->unsignedBigInteger('shop_id')->nullable()->after('product_id');
        });

        DB::statement('
            UPDATE order_items oi
            INNER JOIN products p ON oi.product_id = p.id
            SET oi.shop_id = p.shop_id
        ');

        DB::unprepared('
            CREATE TRIGGER tr_order_items_set_shop_id
            BEFORE INSERT ON order_items
            FOR EACH ROW
            BEGIN
                SET NEW.shop_id = (
                    SELECT shop_id
                    FROM products
                    WHERE id = NEW.product_id
                );
            END
        ');

        Schema::table('order_items', function (Blueprint $table) {
            $table->foreign('shop_id')->references('id')->on('shops')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropForeign(['shop_id']);
            $table->dropColumn('shop_id');
        });

        DB::unprepared('DROP TRIGGER IF EXISTS tr_order_items_set_shop_id');
    }
};
