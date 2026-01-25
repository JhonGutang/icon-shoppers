# Simple & Effective E-Commerce System Flow

This document describes a **simple, production-ready e-commerce system flow** designed to be correct, maintainable, and scalable without unnecessary complexity.

---

## Core Design Principles

- Single identity system for all users
- Role-based access control (RBAC)
- Minimal, enforceable order states
- Payment-first mindset
- Inventory consistency over “real-time” claims
- All actions must be auditable

---

## 1. Identity, Authentication & Roles

### Users
All users are stored in a single `users` table.

### Roles
- `customer`
- `merchant`
- `admin` (optional)

### Authentication Flow
1. User registers using email/phone and password
2. Optional verification (email or OTP)
3. User logs in and receives an API token (Sanctum/JWT)
4. Token includes:
   - `user_id`
   - `role`
   - `abilities` (scoped permissions)

### Authorization
- Role-based and ownership-based authorization
- Enforced using policies or gates
- No role checks directly inside controllers

---

## 2. Merchant & Shop Management

### Shop Creation (Merchant Only)
1. User registers as a merchant
2. Merchant creates a single shop
3. Shop contains:
   - name
   - description
   - status (`active`, `suspended`)
   - owner_id (user reference)

### Rules
- Each product belongs to exactly one shop
- Merchants can only access their own shops, products, and orders
- Customers cannot access merchant resources

---

## 3. Product & Inventory Management

### Product Model
Each product contains:
- name
- description
- price
- stock_quantity
- is_active
- shop_id

### Inventory Rules
- Inventory is checked, not assumed
- Stock is NOT decremented on add-to-cart
- Stock is decremented only on confirmed orders

---

## 4. Shopping Cart Flow

### Cart Characteristics
- One active cart per user
- Stored in the database
- Belongs directly to a user

### Cart Actions
- Add item
- Update quantity
- Remove item

### Important Rule
Cart prices are **not final**.  
Prices and stock are revalidated during checkout.

---

## 5. Checkout & Order Creation

### Checkout Flow
1. Customer initiates checkout
2. System revalidates:
   - product prices
   - stock availability
3. System calculates:
   - subtotal
   - tax
   - shipping
4. Order is created in `PENDING` state
5. Payment intent is created

---

## 6. Payment System (Basic)

### Payment Types
- `online`
- `cash_on_delivery` (optional)

### Payment States
- `pending`
- `paid`
- `failed`
- `refunded`

### Online Payment Flow
1. Create payment intent
2. Customer completes payment via gateway
3. Gateway sends callback/webhook
4. On success:
   - Payment marked as `paid`
   - Order is confirmed

### Cash on Delivery Flow
- Payment remains `pending`
- Order proceeds after merchant confirmation

---

## 7. Order Lifecycle

### Order States
- PENDING
- CONFIRMED
- IN_TRANSIT
- DELIVERED
- COMPLETED
- CANCELLED


### State Rules
- `PENDING` → Order created, awaiting payment or merchant action
- `CONFIRMED` → Payment received or COD accepted
- `IN_TRANSIT` → Order is shipped or out for delivery
- `DELIVERED` → Order delivered to customer
- `COMPLETED` → Auto-completed after a defined time window
- `CANCELLED` → Order cancelled before delivery

### Permissions
- Customer:
  - Can cancel only while `PENDING`
- Merchant:
  - Can confirm, ship, or cancel before delivery
- System:
  - Auto-completes orders after delivery timeout

---

## 8. Inventory Update Timing

### Stock Reduction
- Online payment → after payment is confirmed
- Cash on delivery → after merchant confirmation

### Failure Handling
- If stock is insufficient:
  - Order is cancelled
  - Payment is refunded if already paid
  - Stock remains unchanged

---

## 9. Cancellations & Refunds

### Cancellation Rules
- Customer cancellation allowed only before confirmation
- Merchant cancellation allowed only before delivery

### Refund Flow
1. Order is cancelled
2. Payment status checked
3. Refund record created
4. Payment gateway refund triggered
5. Stock is restored

---

## 10. Order Completion & Reviews

### Completion
- Orders automatically move to `COMPLETED`
- Triggered after delivery + configured time window

### Reviews
- One review per order item
- Only allowed after order completion
- Reviews must be tied to an actual purchase

---

## 11. Admin Capabilities (Minimal)

- View all users, shops, and orders
- Suspend or activate shops
- Resolve disputes
- Issue manual refunds when necessary

---

## 12. System Events (Optional)

Events may be emitted for:
- OrderCreated
- PaymentCompleted
- OrderConfirmed
- OrderCompleted

Used for:
- Notifications
- Emails
- Analytics
- Audit logs

---

## Summary

This system flow is designed to:
- Be simple but correct
- Handle real payments safely
- Avoid common inventory and order bugs

It intentionally avoids overengineering while enforcing critical business rules.
