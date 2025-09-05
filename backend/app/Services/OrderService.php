<?php

namespace App\Services;

use App\Interfaces\Services\OrderServiceInterface;
use App\Interfaces\Repositories\OrderRepositoryInterface;
use App\DTO\OrderDTO;
use App\DTO\OrderItemDTO;
use App\Interfaces\Repositories\ProductRepositoryInterface;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class OrderService implements OrderServiceInterface
{
    protected $orderRepository, $productRepository;

    public function __construct(OrderRepositoryInterface $orderRepository, ProductRepositoryInterface $productRepository)
    {
        $this->orderRepository = $orderRepository;
        $this->productRepository = $productRepository;
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

    public function getCustomerOrders($status, $customerId)
    {
        try {
            DB::beginTransaction();
            $statusId = OrderDTO::getStatusId($status);
            $orders = $this->orderRepository->getCustomersOrder($statusId, $customerId);
            $result = OrderDTO::formatCustomerOrders($orders);
            DB::commit();
            return $result;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function checkoutOrder($customerId, $productsFromRequest, $productIds)
    {
        try {
            DB::beginTransaction();

            $totalAmount = 0;
            $order = $this->orderRepository->saveOrder($customerId);
            $products = $this->productRepository->findProducts($productIds);
            foreach ($productsFromRequest as $productItem) {
                $product = $products->get($productItem['id']);
                if (!$product) {
                    DB::rollBack();
                    return response()->json(['message' => 'Product not found'], 404);
                }
                $formattedOrderItem = OrderItemDTO::fromCheckoutItem($order->id, $productItem, $product);
                $orderItem = $this->orderRepository->saveOrderItems($formattedOrderItem);

                $totalAmount += $orderItem->total;
            }
            $this->orderRepository->updateOrderTotalAmount($order->id, $totalAmount);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

}
