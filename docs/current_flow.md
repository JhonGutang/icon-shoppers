# Current System Flow

This document outlines the operational flow of the Icon Shoppers platform, covering both Customer and Merchant (Shop) perspectives.

## 1. User Onboarding & Authentication

### Merchant (Shop)
- **Registration**: Shops sign up with their shop name, owner details, and credentials.
- **Login**: Accessed via the shop-specific login flow.
- **Session**: Managed via Sanctum tokens (API).

### Customer
- **Registration**: Customers sign up with their name, address, and contact details.
- **Login**: Accessed via the customer login flow.
- **Session**: Managed via Sanctum tokens (API).

---

## 2. Product Management (Merchant Lifecycle)

1. **Dashboard Access**: Merchants see an overview of their products and orders.
2. **Product Creation**: Merchants upload products with images, prices, and stock levels.
3. **Product Visibility**: Merchants can toggle product visibility or feature specific items.
4. **Inventory Updates**: Real-time management of stock quantities.

---

## 3. Shopping Experience (Customer Lifecycle)

1. **Discovery**:
   - Browse the landing page featuring various shops and featured products.
   - View individual shop profiles and their specific product catalogs.
2. **Engagement**:
   - Add products to a persistent shopping cart.
   - Update quantities or remove items from the cart.
3. **Checkout**:
   - Review cart items and total amount.
   - Confirm delivery location.
   - Place order (transitions to 'ordered' status).

---

## 4. Order Fulfillment Flow

The order status progresses through the following stages:

1. **Ordered**: Initial state when a customer places an order.
2. **Approved/Rejected**: Merchant reviews the order and decides to accept or decline it.
3. **Processing/Delivering**: Merchant prepares the item and hands it over for delivery.
4. **Delivered**: Item reaches the destination.
5. **Received**: Customer acknowledges receipt of the item.
6. **Completed**: Final state of a successful transaction.

---

## 5. Feedback Loop
- **Product Rating**: After receiving an order, customers can rate and provide feedback on products.
- **Rating Summaries**: The system automatically updates shop and product rating averages to help other customers.
