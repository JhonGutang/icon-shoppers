<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->unsignedTinyInteger('rating')->comment('Rating from 1 to 5');
            $table->text('feedback')->nullable();
            $table->timestamps();
        
            $table->unique(['product_id', 'customer_id']); // one rating per customer per product
        });
        
    }

    public function down(): void
    {
        Schema::dropIfExists('product_ratings');
    }
};
