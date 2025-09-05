<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['id' => 1, 'status' => 'ordered'],
            ['id' => 2, 'status' => 'approved'],
            ['id' => 3, 'status' => 'rejected'],
            ['id' => 4, 'status' => 'to be delivered'],
            ['id' => 5, 'status' => 'delivering'],
            ['id' => 6, 'status' => 'delivered'],
            ['id' => 7, 'status' => 'received'],
            ['id' => 8, 'status' => 'not_recevied'],
            ['id' => 9, 'status' => 'completed'],
            ['id' => 10, 'status' => 'Failed'],
        ];

        foreach ($statuses as $statusData) {
            DB::table('order_statuses')->insert([
                'id' => $statusData['id'],
                'status' => $statusData['status'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
