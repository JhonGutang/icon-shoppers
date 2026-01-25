# Demo Environment Setup Guide

This guide describes how to set up and run the **Icon Shoppers** demo environment. The goal is to simulate a realistic e-commerce experience with multiple shops and products.

## 🚀 Quick Setup

To populate the database with initial demo data, run the following commands in the `backend` directory:

```bash
php artisan migrate:fresh
php artisan db:seed
```

> [!NOTE]
> The default seeders (`DatabaseSeeder`) will create several shops and customers as defined in `SellerAccountSeeder` and `CustomerAccountSeeder`.

---

## 🏗️ Demo Requirements

For a complete demonstration, ensure your environment meets the following criteria:

### 1. Business/Seller Accounts
Create or verify **3 demo business accounts**. Each should have:
- A unique shop name and description.
- At least **20 items** listed for sale to demonstrate pagination and variety.
- High-quality (or placeholder) product images and realistic pricing.

### 2. Customer Account
Create or verify at least **1 demo customer account**.
- This account will be used to test the shopping flow, cart management, and checkout process.

---

## 📝 Demo Walkthrough

Follow these steps to experience the full order lifecycle:

### Phase 1: Merchant Management
1. **Login** as one of the demo sellers (e.g., `maria.santos@gmail.com`).
2. **Dashboard**: Observe the overview of products and sales.
3. **Product Management**: Add a new product or edit existing ones to see real-time updates.

### Phase 2: Customer Experience
1. **Login** as the demo customer (e.g., `john1.doe@example.com`).
2. **Browse**: Explore the different shops and use filters/search to find products.
3. **Shopping**: Add multiple items from different shops to your cart.
4. **Checkout**: Complete the checkout process to place an order.

### Phase 3: Order Fulfillment
1. **Return** to the Seller Dashboard.
2. **Orders**: Verify that the new order appears in the merchant's view.
3. **Processing**: Experience the flow from "Received" to "Processing" (as described in [flow.md](file:///c:/Users/jhonb/Documents/Websites/icon-shoppers/docs/flow.md)).

---

## 🔑 Default Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Seller 1** | `maria.santos@gmail.com` | `password` |
| **Seller 2** | `carlo.cruz@gmail.com` | `password` |
| **Seller 3** | `sarah.crafts@gmail.com` | `password` |
| **Customer** | `john1.doe@example.com` | `password` |

> [!TIP]
> You can find more details about the system architecture and logic in the project root's [README.md](file:///c:/Users/jhonb/Documents/Websites/icon-shoppers/backend/README.md).

