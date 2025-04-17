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
        Schema::create('shop_rating_summaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained('shops')->=onDelete('cascade');
            $table->integer('rating_count')->default(0);
            $table->decimal('average_rating_score'. 3, 2)->nullable()->default(null);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shop_rating_summaries');
    }
};
