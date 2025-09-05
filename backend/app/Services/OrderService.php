<?php

namespace App\Services;

use App\Interfaces\Services\OrderServiceInterface;
use App\Interfaces\Repositories\OrderRepositoryInterface;
use App\DTO\OrderDTO;
use Illuminate\Support\Facades\DB;

class OrderService implements OrderServiceInterface
{
    protected $orderRepository;

    public function __construct(OrderRepositoryInterface $orderRepository)
    {
        $this->orderRepository = $orderRepository;
    }

    public function getOrders($status, $shopId)
    {
        try {
            DB::beginTransaction();
            $statusId = OrderDTO::getStatusId($status);   
            $orders = $this->orderRepository->all($statusId, $shopId);
            $result = $orders->map(function ($order) {
                return OrderDTO::fromOrder($order)->toArray();
            });

            DB::commit();
            return $result;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateOrderStatus($status, $shopId) {
        try {
            DB::beginTransaction();
            $statusId = OrderDTO::getStatusId($status);   
            $orders = $this->orderRepository->update($statusId, $shopId);
            DB::commit();
            return $orders;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
