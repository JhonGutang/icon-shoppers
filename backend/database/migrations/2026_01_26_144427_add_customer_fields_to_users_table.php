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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->unique()->nullable()->after('email');
            $table->string('profile_picture')->nullable()->after('avatar');
            $table->string('street')->nullable()->after('address');
            $table->string('barangay')->nullable()->after('street');
            $table->string('city')->nullable()->after('barangay');
            $table->string('postal_code')->nullable()->after('city');

            $table->index('phone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['phone']);
            $table->dropColumn(['phone', 'profile_picture', 'street', 'barangay', 'city', 'postal_code']);
        });
    }
};
