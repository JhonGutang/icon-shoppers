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
        $orders = $this->orderRepository->all($status, $shopId);
        return $orders->map(function ($order) {
            return OrderDTO::fromOrder($order)->toArray();
        });
    }

    public function updateOrderStatus($status, $orderId) {
        return $this->orderRepository->update($status, $orderId);
    }

    public function getCustomerOrders($status, $userId)
    {
        $orders = $this->orderRepository->getCustomersOrder($status, $userId);
        return OrderDTO::formatCustomerOrders($orders);
    }

    public function checkoutOrder($userId, $productsFromRequest, $productIds)
    {
        try {
            DB::beginTransaction();

            $products = $this->productRepository->findProducts($productIds);
            
            // Group products by shop since an order belongs to a shop
            $productsByShop = [];
            foreach ($productsFromRequest as $item) {
                $product = $products->get($item['id']);
                $productsByShop[$product->shop_id][] = [
                    'item' => $item,
                    'product' => $product
                ];
            }

            $createdOrders = [];
            foreach ($productsByShop as $shopId => $items) {
                $totalAmount = 0;
                $order = $this->orderRepository->saveOrder($userId, $shopId);
                
                foreach ($items as $data) {
                    $item = $data['item'];
                    $product = $data['product'];
                    
                    $formattedOrderItem = OrderItemDTO::fromCheckoutItem($order->id, $item, $product);
                    $orderItem = $this->orderRepository->saveOrderItems($formattedOrderItem);
                    $totalAmount += $orderItem->total;
                }
                
                $this->orderRepository->updateOrderTotalAmount($order->id, $totalAmount);
                $createdOrders[] = $order;
            }

            DB::commit();
            return $createdOrders;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

}
