<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing shops with null slugs
        $shops = DB::table('shops')->whereNull('slug')->get();

        foreach ($shops as $shop) {
            $slug = \Illuminate\Support\Str::slug($shop->name);

            // Ensure unique slug
            $originalSlug = $slug;
            $counter = 1;
            while (DB::table('shops')->where('slug', $slug)->where('id', '!=', $shop->id)->exists()) {
                $slug = $originalSlug.'-'.$counter;
                $counter++;
            }

            DB::table('shops')->where('id', $shop->id)->update(['slug' => $slug]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse - slugs can stay
    }
};
