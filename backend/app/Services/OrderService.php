<?php

namespace App\Services;

use App\DTO\OrderDTO;
use App\DTO\OrderItemDTO;
use App\Interfaces\Repositories\OrderRepositoryInterface;
use App\Interfaces\Repositories\ProductRepositoryInterface;
use App\Interfaces\Services\OrderServiceInterface;
use App\Models\Order;
use App\Notifications\OrderPlacedNotification;
use App\Notifications\OrderStatusChangedNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderService implements OrderServiceInterface
{
    protected $orderRepository;

    protected $productRepository;

    public function __construct(OrderRepositoryInterface $orderRepository, ProductRepositoryInterface $productRepository)
    {
        $this->orderRepository = $orderRepository;
        $this->productRepository = $productRepository;
    }

    public function getOrders($status, $shopId, $page = 1, $perPage = 20)
    {
        $normalizedStatus = $status !== 'ALL' ? Order::normalizeStatus($status) : 'ALL';
        $paginatedOrders = $this->orderRepository->all($normalizedStatus, $shopId, $page, $perPage);

        return OrderDTO::formatPaginatedOrders($paginatedOrders);
    }

    public function updateOrderStatus($status, $orderId)
    {
        $normalizedStatus = Order::normalizeStatus($status);

        $order = $this->orderRepository->update($normalizedStatus, $orderId);

        // Notify buyer of status update
        try {
            $order->user->notify(new OrderStatusChangedNotification($order));
        } catch (\Exception $e) {
            Log::error('Real-time: Order status changed notification failure', [
                'order_id' => $order->id,
                'error' => $e->getMessage(),
            ]);
        }

        return $order;
    }

    public function getCustomerOrders($status, $userId, $page = 1, $perPage = 20)
    {
        $normalizedStatus = $status !== 'ALL' ? Order::normalizeStatus($status) : 'ALL';
        $paginatedOrders = $this->orderRepository->getCustomersOrder($normalizedStatus, $userId, $page, $perPage);

        return OrderDTO::formatPaginatedOrders($paginatedOrders);
    }

    public function checkoutOrder($userId, $productsFromRequest, $productIds, array $data = [])
    {
        try {
            DB::beginTransaction();

            $products = $this->productRepository->findProducts($productIds);

            // Group products by shop since an order belongs to a shop
            $productsByShop = [];
            foreach ($productsFromRequest as $item) {
                // Find product in the collection
                $product = $products->firstWhere('id', $item['id']);
                if (! $product) {
                    continue;
                }

                $productsByShop[$product->shop_id][] = [
                    'item' => $item,
                    'product' => $product,
                ];
            }

            $createdOrders = [];
            foreach ($productsByShop as $shopId => $items) {
                // Fetch shop to get shipping fee (eager loaded with products)
                $shop = $items[0]['product']->shop;
                $shippingFee = (float) ($shop->shipping_fee ?? 0);

                $subtotal = 0;

                // Calculate subtotal first to save with order
                foreach ($items as $itemData) {
                    $item = $itemData['item'];
                    $product = $itemData['product'];
                    $subtotal += (float) $product->price * (int) $item['quantity'];
                }

                $orderData = array_merge($data, [
                    'subtotal' => $subtotal,
                    'shipping_fee' => $shippingFee,
                    'total_amount' => $subtotal + $shippingFee,
                    'delivery_method' => $data['delivery_method'] ?? 'Standard Delivery',
                ]);

                $order = $this->orderRepository->saveOrder($userId, $shopId, $orderData);

                foreach ($items as $itemData) {
                    $item = $itemData['item'];
                    $product = $itemData['product'];

                    $formattedOrderItem = OrderItemDTO::fromCheckoutItem($order->id, $item, $product);
                    $this->orderRepository->saveOrderItems($formattedOrderItem);

                    // Increment sales count for each product
                    $this->productRepository->incrementSalesCount($product->id, (int) $item['quantity']);
                }

                $createdOrders[] = $order;

                // Notify seller of new order
                try {
                    $shop->owner->notify(new OrderPlacedNotification($order));
                } catch (\Exception $e) {
                    Log::error('Real-time: Order placed notification failure', [
                        'order_id' => $order->id,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            DB::commit();

            return $createdOrders;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getOrderDetails($orderNumber)
    {
        $order = $this->orderRepository->getOrderByNumber($orderNumber);

        return OrderDTO::fromOrder($order)->toArray();
    }

    public function cancelOrder($orderId, $reason)
    {
        return $this->orderRepository->cancelOrder($orderId, $reason);
    }
}
