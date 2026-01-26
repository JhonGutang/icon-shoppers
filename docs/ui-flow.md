# E-Commerce App — Simple & Robust UI Flow

## 1. App Entry & Authentication

### App Initialization
- App loads
- Users can browse products and shops without logging in

### Authentication (Triggered Only When Required)
- Login
- Register

**Notes**
- Single account system
- No seller/customer selection during login
- Seller capabilities unlocked after creating a shop

---

## 2. Global Navigation

### Customer (Default Experience)
**Top Navigation Bar**
- Logo (Home)
- Search (global: products + shops)
- Shops
- Products
- Cart (icon, always visible)
- Profile (dropdown)

**Profile Dropdown**
- My Orders
- Wishlist
- My Account
- Logout

---

### Seller Access
- Seller mode available via Profile Dropdown after shop creation
- Switch between Customer and Seller views

---

## 3. Home (Customer)

### Home Page Content
- Personalized product recommendations
- Top shops
- Popular products
- Recently viewed products

> Home acts as the main landing page for customers (no separate dashboard)

---

## 4. Products

### Products Listing Page
- Product grid
- Search
- Filters (category, price, rating)
- Sort (popular, newest, price)

### Product Card
- Product image
- Product name
- Price
- Rating
- Shop name
- Add to Cart
- Add to Wishlist

---

## 5. Product Details Page

### Primary Actions (Above the Fold)
- Product images
- Product name
- Price
- Variant selection (size, color, etc.)
- Add to Cart (primary CTA)
- Add to Wishlist

### Product Information
- Description
- Specifications
- Shipping & delivery info
- Return policy

### Social Proof
- Product ratings
- User reviews

### Related Navigation
- View shop
- Related products

---

## 6. Shops

### Shops Listing Page
- Shop cards
- Search
- Filters (rating, category)

### Shop Card
- Shop name
- Shop rating
- Short description
- View shop

---

## 7. Shop Page

### Shop Overview
- Shop banner
- Shop name
- Rating
- Description
- Follow shop

### Shop Products
- Product grid
- Search
- Filters

### Shop Feedback
- Shop reviews
- Ratings breakdown

---

## 8. Cart & Checkout

### Cart Page
- List of cart items
- Quantity controls
- Remove item
- Price breakdown
- Proceed to Checkout

---

### Checkout Flow
1. Shipping address
2. Delivery method
3. Payment method
4. Order review
5. Place order

### Checkout States
- Payment processing
- Payment failed
- Order confirmed

---

## 9. Orders (Customer)

### Orders List Page
- All orders
- Status badges (processing, shipped, delivered, canceled)

### Order Details Page
- Order summary
- Items purchased
- Shipping status
- Payment info
- Cancel / request refund (if applicable)
- Reorder

---

## 10. Wishlist

### Wishlist Page
- Saved products
- Move to cart
- Remove item

---

## 11. Seller Experience

### Seller Dashboard
- Sales summary
- Orders summary
- Low stock alerts
- Recent reviews

---

### Seller Navigation (Sidebar)
- Dashboard
- Products
- Orders
- Reviews
- Shop Settings
- Logout

---

## 12. Seller Products

### Products List
- Product table
- Status (draft / published)
- Stock level

### Product Management
- Create product
- Edit product
- Delete product

---

## 13. Seller Orders

### Orders List
- Incoming orders
- Order status

### Order Details
- Customer info
- Items ordered
- Fulfillment actions
  - Mark as shipped
  - Cancel / refund

---

## 14. Seller Reviews & Feedback
- Product reviews
- Shop reviews
- Reply to reviews

---

## 15. Account & Settings (Both Roles)

### Account Page
- Profile information
- Saved addresses
- Payment methods

---

## 16. System States

### Empty States
- No products available
- Empty cart
- No orders yet

### Error States
- Payment failed
- Network error
- Unauthorized access

### Loading States
- Skeleton loaders
- Button loading indicators

---

## 17. Core Design Principles
- Optimize customer flow for discovery → purchase
- Optimize seller flow for management → fulfillment
- Avoid role selection during authentication
- Keep cart and checkout always accessible
- Follow proven e-commerce UX patterns
