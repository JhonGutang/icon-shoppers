# Icon Shoppers - Unified Application Flow

> **Last Updated:** 2026-01-26  
> **Scope:** Local e-commerce platform (Pinamungajan to Balamban region)  
> **Payment:** Cash on Delivery (COD) only

---

## 1. Authentication & Account System

### Unified Account Model
- **Single account type** for all users
- No role selection during registration/login
- Users start as customers by default
- Can upgrade to seller by creating a shop

### Registration Flow
**Required Fields:**
- Full name
- Email address
- Phone number
- Password (with confirmation)
- Delivery address (street, barangay, city)

**Process:**
1. User fills registration form
2. System validates input
3. Account created with customer privileges
4. Redirect to main page (home/dashboard)

### Login Flow
**Credentials:**
- Email or phone number
- Password

**Process:**
1. User enters credentials
2. System authenticates via Sanctum
3. If successful → redirect to main page
4. If failed → display error message

**Session Management:**
- Token-based authentication (Laravel Sanctum)
- Persistent login option (remember me)
- Auto-logout after inactivity (configurable)

---

## 2. Customer Experience

### 2.1 Navigation Structure

#### Top Navigation Bar
- **Logo** → Home
- **Search Bar** → Global search (products + shops)
- **Categories** → Dropdown menu
- **Shops** → Browse all shops
- **Products** → Browse all products
- **Cart Icon** → Badge with item count
- **Profile Dropdown:**
  - My Orders
  - Wishlist
  - My Account
  - Create Shop (if no shop exists)
  - Switch to Seller Mode (if shop exists)
  - Logout

---

### 2.2 Home Page (Dashboard)

#### Content Sections
1. **Hero/Banner Section**
   - Featured promotions
   - Seasonal campaigns
   - Local farmer highlights

2. **Product Recommendations**
   - Personalized based on browsing history
   - Recently viewed products
   - Popular products (by sales)

3. **Top Shops Panel** (Right sidebar or section)
   - Shop name
   - Shop rating
   - Number of products
   - View shop button

4. **Categories Grid**
   - Visual category cards
   - Quick navigation to category pages

---

### 2.3 Products Listing Page

#### Layout
- **Search Bar** → Filter products by name/description
- **Filters Panel** (Left sidebar or collapsible)
  - Category (multi-select)
  - Price range (min-max slider)
  - Rating (star filter)
  - Date added (newest, oldest)
  - Sales (most sold, least sold)
- **Sort Options** (Dropdown)
  - Popular (most sales)
  - Newest
  - Price: Low to High
  - Price: High to Low
  - Highest Rated
- **Product Grid** (Responsive: 4 cols desktop, 2 cols mobile)
- **Pagination** (20 items per page)

#### Product Card
```
┌─────────────────────┐
│  Product Image      │ ← Fallback if no image
│  (with hover zoom)  │
├─────────────────────┤
│ Product Name        │
│ ★★★★☆ (4.5) 120    │ ← Rating + review count
│ ₱299.00             │
│ Shop Name           │
│ 🔥 500 sold         │ ← Number of sales
├─────────────────────┤
│ [Add to Cart] ♡     │ ← Add to wishlist icon
└─────────────────────┘
```

**Product Card Actions:**
- Click image/name → Product details page
- Click shop name → Shop page
- Add to Cart → Adds to cart (with toast notification)
- Add to Wishlist → Saves to wishlist (heart icon filled)

---

### 2.4 Product Details Page

#### Above the Fold
- **Product Image Gallery**
  - Main image (zoomable)
  - Thumbnail carousel (4-6 images)
  - Fallback image if none provided

- **Product Information**
  - Product name (H1)
  - Rating stars + review count (clickable → scrolls to reviews)
  - Price (large, bold)
  - Stock status (In Stock / Out of Stock / Low Stock)

- **Variant Selection** (if applicable)
  - Size dropdown
  - Color selector
  - Price updates dynamically

- **Quantity Selector**
  - Minus/Plus buttons
  - Input field (manual entry)
  - Max quantity = available stock

- **Primary Actions**
  - **Add to Cart** (primary button)
  - **Add to Wishlist** (secondary button/icon)

#### Product Details Section
- **Description Tab**
  - Full product description (rich text)
  - Specifications (key-value pairs)
  
- **Shop Information Card**
  - Shop logo/banner
  - Shop name (clickable → shop page)
  - Shop rating (★★★★☆)
  - Number of products
  - "Visit Shop" button

- **Shipping & Delivery**
  - Estimated delivery time
  - Shipping fee (if applicable)
  - Return policy

#### Reviews & Ratings Section
- **Rating Summary**
  - Average rating (large display)
  - Total reviews count
  - Rating distribution (5★ to 1★ with bars)

- **Individual Reviews**
  - Reviewer name
  - Star rating
  - Review text
  - Date posted
  - Helpful votes (optional)
  - Pagination (10 reviews per page)

- **Write a Review** (if user purchased product)
  - Star rating selector
  - Text area for review
  - Submit button

#### Related Products
- "You May Also Like" carousel
- Same category products
- 6-8 product cards (horizontal scroll)

---

### 2.5 Shop Page

#### Shop Header
- **Shop Banner Image** (cover photo)
- **Shop Logo** (circular, overlapping banner)
- **Shop Name** (H1)
- **Shop Rating** (★★★★☆ + review count)
- **Shop Description** (2-3 lines)
- **Follow Shop Button** (if logged in)
- **Follower Count**

#### Shop Navigation Tabs
1. **All Products** (default)
2. **Top Selling** (sorted by sales)
3. **Featured** (manually curated by seller)
4. **Categories** (if shop has multiple categories)

#### Products Section
- Same product grid as main products page
- Filters and sorting available
- Search within shop

#### Shop Reviews Section
- Overall shop rating
- Customer feedback about service, delivery, product quality
- Pagination

---

### 2.6 Search Functionality

#### Search Bar Behavior
- **Real-time suggestions** (as user types)
  - Product names
  - Shop names
  - Categories

#### Search Results Page
- **Tabs:**
  - Products (default)
  - Shops

- **Products Tab:**
  - Same grid layout as products listing
  - Filters and sorting available
  - Highlight search term in results

- **Shops Tab:**
  - Shop cards (grid or list view)
  - Shop name, description, rating
  - "View Shop" button

- **Empty State:**
  - "No results found for '{search_term}'"
  - Suggestions: Browse categories, check spelling

---

### 2.7 Shopping Cart

#### Cart Page Layout
- **Cart Items List** (grouped by shop)

**Shop Group:**
```
┌─────────────────────────────────────┐
│ 🏪 Shop Name                        │
├─────────────────────────────────────┤
│ [img] Product Name                  │
│       Variant: Size M, Color Red    │
│       ₱299.00 × [2] = ₱598.00      │
│       [Remove]                      │
├─────────────────────────────────────┤
│ [img] Another Product               │
│       ₱150.00 × [1] = ₱150.00      │
│       [Remove]                      │
├─────────────────────────────────────┤
│ Shop Subtotal: ₱748.00              │
└─────────────────────────────────────┘
```

#### Cart Controls
- **Quantity Controls:** +/- buttons per item
- **Remove Item:** Individual removal
- **Select Items:** Checkboxes to choose which items to checkout
- **Select All:** Checkbox to select all items

#### Cart Summary (Right sidebar)
- **Items Subtotal:** Sum of selected items
- **Shipping Fee:** Per shop or flat rate
- **Total:** Grand total
- **Proceed to Checkout** (primary button)
  - Only enabled if at least one item selected

#### Empty State
- "Your cart is empty"
- "Browse Products" button

---

### 2.8 Checkout Flow

#### Step 1: Shipping Address
- **Use Saved Address** (dropdown if exists)
- **Or Enter New Address:**
  - Full name
  - Phone number
  - Street address
  - Barangay
  - City
  - Postal code
  - "Save this address" checkbox

#### Step 2: Delivery Method
- Standard delivery (3-5 days)
- Express delivery (1-2 days) - if available
- Estimated delivery date displayed

#### Step 3: Payment Method
- **Cash on Delivery (COD)** - default and only option for MVP
- Payment instructions displayed

#### Step 4: Order Review
- **Order Summary** (grouped by shop)
  - Product details
  - Quantities
  - Prices
- **Shipping Address** (with edit link)
- **Delivery Method**
- **Payment Method**
- **Price Breakdown:**
  - Subtotal
  - Shipping fee
  - **Total**
- **Order Notes** (optional text area)
  - Special delivery instructions
  - Contact preferences

#### Step 5: Place Order
- **Place Order** button
- Loading state during processing
- **Success:**
  - Redirect to Order Confirmation page
  - Clear cart
- **Failure:**
  - Error message
  - Retry option

#### Order Confirmation Page
- ✓ Success message
- Order number (large display)
- Estimated delivery date
- Order summary
- "View Order Details" button
- "Continue Shopping" button

---

### 2.9 Order Management (Customer)

#### My Orders Page
- **Filter Tabs:**
  - All
  - Pending (ordered, awaiting approval)
  - Processing (approved, being prepared)
  - Delivering (shipped)
  - Delivered
  - Completed (received)
  - Cancelled/Rejected

#### Order Card
```
┌─────────────────────────────────────┐
│ Order #12345          [Status Badge]│
│ Jan 26, 2026                        │
├─────────────────────────────────────┤
│ [img] Product Name × 2              │
│ [img] Another Product × 1           │
│ +2 more items                       │
├─────────────────────────────────────┤
│ Total: ₱1,248.00                    │
│ [View Details] [Track Order]        │
└─────────────────────────────────────┘
```

#### Order Details Page
- **Order Information:**
  - Order number
  - Order date
  - Status (with timeline/progress bar)

- **Status Timeline:**
  ```
  Ordered → Approved → Processing → Delivering → Delivered → Received
  ```

- **Items Ordered** (grouped by shop)
  - Product images
  - Product names (with variants)
  - Quantities
  - Prices

- **Shipping Address**
- **Payment Method**
- **Price Breakdown**

- **Order Actions:**
  - **Cancel Order** (if status = Ordered or Approved)
    - Confirmation modal
    - Reason selection (optional)
  - **Mark as Received** (if status = Delivered)
    - Confirms receipt
    - Triggers review prompt
  - **Leave Review** (if status = Completed and not reviewed)
    - Opens review modal for each product

#### Order Status Flow
1. **Ordered** → Customer places order
2. **Approved/Rejected** → Admin/Seller reviews
   - If rejected: reason displayed, order ends
3. **Processing** → Seller prepares items
4. **Delivering** → Items shipped/in transit
5. **Delivered** → Items arrived at destination
6. **Received** → Customer confirms receipt
7. **Completed** → Final state

**Customer Can Cancel:**
- Anytime before "Delivering" status
- Cannot cancel once in transit

---

### 2.10 Wishlist

#### Wishlist Page
- **Product Grid** (same as products listing)
- **Product Card Actions:**
  - Move to Cart
  - Remove from Wishlist
  - View Product

#### Empty State
- "Your wishlist is empty"
- "Browse Products" button

---

### 2.11 Account Settings

#### Profile Information
- Full name
- Email (verified badge)
- Phone number
- Profile picture upload
- Change password

#### Saved Addresses
- List of saved addresses
- Set default address
- Add new address
- Edit/Delete existing addresses

#### Account Actions
- Update profile
- Change password
- Delete account (with confirmation)

---

## 3. Seller Experience

### 3.1 Becoming a Seller

#### Shop Creation Flow
**Access:** Profile Dropdown → "Create Shop"

**Shop Creation Form:**
- Shop name (unique)
- Shop description (rich text)
- Shop category/type
- Shop logo (image upload)
- Shop banner (image upload)
- Business information (optional for MVP)
  - Business registration number
  - Tax ID
  - Contact email
  - Contact phone

**Requirements & Rules:**
- Must agree to seller terms and conditions
- Must provide valid contact information
- Shop name must be unique

**Process:**
1. User fills shop creation form
2. System validates input
3. Shop created and linked to user account
4. User gains seller privileges
5. Redirect to Seller Dashboard

**Post-Creation:**
- Profile dropdown now shows "Switch to Seller Mode"
- User can toggle between Customer and Seller views

---

### 3.2 Seller Navigation

#### Sidebar Menu
- **Dashboard** (home icon)
- **Products** (box icon)
  - All Products
  - Add New Product
- **Orders** (shopping bag icon)
  - All Orders
  - Pending Approval
  - Processing
  - Completed
- **Reviews** (star icon)
- **Shop Settings** (gear icon)
- **Analytics** (chart icon) - future
- **Switch to Customer Mode** (toggle, top-right)
- **Logout**

---

### 3.3 Seller Dashboard

#### Summary Cards (Top Row)
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Total Sales  │ │ Pending      │ │ Total        │ │ Average      │
│ ₱45,230      │ │ Orders: 12   │ │ Products: 48 │ │ Rating: 4.5★ │
│ This Month   │ │ Action Req.  │ │ 3 Low Stock  │ │ 89 Reviews   │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

#### Recent Orders Section
- **Table View:**
  - Order number
  - Customer name
  - Order date
  - Total amount
  - Status
  - Quick actions (View, Approve, Process)
- **Show last 10 orders**
- "View All Orders" link

#### Low Stock Alerts
- **Product list:**
  - Product image (thumbnail)
  - Product name
  - Current stock
  - "Edit Product" link
- **Alert threshold:** Stock < 10 (configurable)

#### Recent Reviews
- **Last 5 reviews:**
  - Product name
  - Customer name
  - Rating
  - Review snippet
  - Date
- "View All Reviews" link

---

### 3.4 Products Management

#### All Products Page

**Table View:**
| Image | Product Name | Price | Stock | Status | Sales | Actions |
|-------|--------------|-------|-------|--------|-------|---------|
| [img] | Product A    | ₱299  | 45    | Published | 120 | Edit / Delete |
| [img] | Product B    | ₱150  | 5     | Draft | 0 | Edit / Delete |

**Features:**
- **Search:** Filter by product name
- **Filter:** Status (All, Published, Draft, Out of Stock)
- **Sort:** Name, Price, Stock, Sales
- **Bulk Actions:** Delete selected, Publish selected
- **Add Product** button (top-right, primary)

#### Add/Edit Product Form

**Basic Information:**
- Product name (required)
- Product description (rich text editor, required)
- Category (dropdown, required)
- Tags (comma-separated, optional)

**Pricing & Inventory:**
- Price (required, ₱)
- Compare at price (optional, for showing discounts)
- Stock quantity (required, number)
- SKU (optional, auto-generated if empty)
- Low stock threshold (default: 10)

**Product Images:**
- Multiple image upload (drag & drop)
- Reorder images (drag to reorder)
- Set primary image
- Maximum 10 images
- Fallback image if none uploaded

**Variants** (Optional, expandable section)
- **Variant Types:** Size, Color, Material, etc.
- **Add Variant:**
  - Variant name (e.g., "Size: Medium")
  - Price adjustment (+₱50 or -₱20)
  - Stock quantity
  - SKU
- **Variant Matrix View:**
  ```
  | Size | Color | Price | Stock | SKU |
  |------|-------|-------|-------|-----|
  | S    | Red   | ₱299  | 10    | PR-S-R |
  | M    | Red   | ₱299  | 15    | PR-M-R |
  | S    | Blue  | ₱299  | 8     | PR-S-B |
  ```

**Shipping:**
- Weight (kg)
- Dimensions (L × W × H cm)
- Shipping fee override (optional)

**Visibility:**
- Status: Published / Draft
- Featured product (checkbox)

**Actions:**
- **Save as Draft**
- **Publish** (makes product visible to customers)
- **Cancel** (discard changes)

#### Delete Product
- **Confirmation Modal:**
  - "Are you sure you want to delete this product?"
  - Warning: "This action cannot be undone"
  - "Delete" (danger button) / "Cancel"
- **Soft Delete:** Product hidden but retained for order history

---

### 3.5 Orders Management (Seller)

#### All Orders Page

**Filter Tabs:**
- All
- Pending Approval (requires action)
- Approved
- Processing
- Delivering
- Completed
- Rejected/Cancelled

**Table View:**
| Order # | Customer | Date | Items | Total | Status | Actions |
|---------|----------|------|-------|-------|--------|---------|
| #12345  | John Doe | Jan 26 | 3 | ₱1,248 | Pending | View / Approve / Reject |
| #12344  | Jane Smith | Jan 25 | 1 | ₱299 | Processing | View / Mark Shipped |

**Search & Filter:**
- Search by order number or customer name
- Date range filter
- Status filter

#### Order Details Page

**Order Information:**
- Order number (large display)
- Order date and time
- Current status (badge)

**Customer Information:**
- Customer name
- Phone number
- Email
- Shipping address (formatted)

**Items Ordered** (from this shop only)
- Product images
- Product names (with variants)
- Quantities
- Unit prices
- Subtotals

**Order Summary:**
- Items subtotal
- Shipping fee
- **Total**

**Order Notes:**
- Customer's delivery instructions
- Internal seller notes (editable)

**Order Actions** (based on status):

1. **If Pending:**
   - **Approve Order** (green button)
     - Confirmation: "Approve this order?"
     - Changes status to "Approved"
   - **Reject Order** (red button)
     - Requires rejection reason (dropdown + text)
     - Reasons: Out of stock, Invalid address, Customer request, Other
     - Changes status to "Rejected"

2. **If Approved:**
   - **Start Processing** (primary button)
     - Changes status to "Processing"
   - **Cancel Order** (secondary button)
     - Requires cancellation reason

3. **If Processing:**
   - **Mark as Delivering** (primary button)
     - Optional: Add tracking number
     - Changes status to "Delivering"
   - **Cancel Order** (secondary button)

4. **If Delivering:**
   - **Mark as Delivered** (primary button)
     - Confirmation: "Confirm delivery?"
     - Changes status to "Delivered"

5. **If Delivered:**
   - Waiting for customer to mark as "Received"
   - No seller actions available

6. **If Received (Completed):**
   - View only
   - Option to view customer review (if left)

**Order Timeline:**
- Visual timeline showing status progression
- Timestamps for each status change
- Who performed each action (customer/seller/admin)

#### Rejected Orders Feedback
- When admin/system rejects seller's order approval
- Notification sent to seller
- Rejection reason displayed in order details
- Seller can view and acknowledge feedback

---

### 3.6 Reviews Management

#### Reviews Page

**Filter Options:**
- All Reviews
- By Rating (5★, 4★, 3★, 2★, 1★)
- By Product (dropdown)
- Date range

**Review List:**
```
┌─────────────────────────────────────┐
│ [Product Image] Product Name        │
│ ★★★★☆ 4.0                          │
│ John Doe - Jan 26, 2026             │
│ "Great product! Fast delivery..."   │
│                                     │
│ [Reply to Review] (future feature)  │
└─────────────────────────────────────┘
```

**Review Details:**
- Product name (clickable → product edit)
- Customer name
- Rating (stars)
- Review text
- Date posted
- Order number (reference)

**Actions (Future):**
- Reply to review
- Flag inappropriate review
- Thank customer

---

### 3.7 Shop Settings

#### Shop Information
- Shop name (editable)
- Shop description (rich text)
- Shop category
- Shop logo (upload/change)
- Shop banner (upload/change)

#### Business Information
- Business registration number
- Tax ID
- Contact email
- Contact phone
- Business address

#### Shop Policies (Future)
- Return policy
- Shipping policy
- Terms and conditions

#### Actions:
- **Save Changes**
- **Deactivate Shop** (requires confirmation)

---

## 4. Admin/System Features

### 4.1 Order Approval System

**Admin Dashboard:**
- View all orders across all shops
- Approve or reject orders
- Provide rejection reasons

**Approval Flow:**
1. Customer places order → Status: "Ordered"
2. Admin reviews order
3. Admin approves → Status: "Approved" → Seller can process
4. Admin rejects → Status: "Rejected" → Customer notified with reason

**Rejection Reasons:**
- Payment verification failed
- Suspicious activity
- Address outside delivery area
- Product unavailable
- Other (with custom message)

---

### 4.2 Notifications System (WebSocket)

#### Notification Types

**Customer Notifications:**
- Order approved
- Order rejected (with reason)
- Order processing
- Order shipped
- Order delivered
- Review reminder (after delivery)

**Seller Notifications:**
- New order received
- Order cancelled by customer
- New review on product
- Low stock alert
- Order rejected by admin (with feedback)

**Notification Center:**
- Bell icon in navigation (with unread count badge)
- Dropdown panel showing recent notifications
- Mark as read
- View all notifications page

**WebSocket Implementation:**
- Real-time push notifications
- Toast notifications for important updates
- Persistent notification history

---

## 5. Technical Implementation

### 5.1 Frontend Architecture (Next.js + TypeScript)

#### State Management
- **TanStack Query (React Query)** for server state
  - Caching
  - Automatic refetching
  - Optimistic updates
- **Zustand/Context** for client state
  - Cart state
  - User session
  - UI state (modals, drawers)

#### API Layer
- **Axios** for HTTP requests
- Centralized API client with interceptors
- Automatic token refresh
- Error handling middleware

#### Caching Strategy
- **Product listings:** Cache for 5 minutes
- **Product details:** Cache for 10 minutes
- **Cart:** No cache (always fresh)
- **Orders:** Cache for 1 minute
- **User profile:** Cache for 15 minutes

#### Component Structure
```
components/
├── customer/
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── CartItem.tsx
│   └── OrderCard.tsx
├── seller/
│   ├── ProductForm.tsx
│   ├── OrderTable.tsx
│   └── DashboardCard.tsx
├── shared/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── SearchBar.tsx
│   └── Notification.tsx
└── ui/ (Shadcn components)
    ├── button.tsx
    ├── input.tsx
    ├── card.tsx
    └── ...
```

---

### 5.2 Backend Architecture (Laravel)

#### Request Flow
```
Form Request → Controller → Service → Repository → Model
```

**Example: Place Order**
1. `PlaceOrderRequest` - Validates cart items, address, payment method
2. `OrderController@store` - Orchestrates the flow
3. `OrderService@createOrder` - Business logic (calculate totals, create order records)
4. `OrderRepository@create` - Database operations
5. `Order` model - Eloquent relationships

#### Key Services
- `AuthService` - Registration, login, token management
- `ProductService` - Product CRUD, stock management
- `CartService` - Cart operations, validation
- `OrderService` - Order creation, status updates
- `ReviewService` - Review submission, aggregation
- `NotificationService` - WebSocket notifications

#### Repositories
- `UserRepository`
- `ShopRepository`
- `ProductRepository`
- `OrderRepository`
- `ReviewRepository`

---

### 5.3 Database Schema (Key Tables)

#### users
- id, name, email, phone, password, profile_picture, created_at, updated_at

#### shops
- id, user_id, name, slug, description, logo, banner, rating, created_at, updated_at

#### products
- id, shop_id, name, slug, description, price, stock, sku, status, featured, created_at, updated_at

#### product_images
- id, product_id, image_path, is_primary, order

#### product_variants
- id, product_id, name, price_adjustment, stock, sku

#### orders
- id, user_id, order_number, status, subtotal, shipping_fee, total, shipping_address, notes, created_at, updated_at

#### order_items
- id, order_id, product_id, variant_id, quantity, price, subtotal

#### reviews
- id, order_id, product_id, user_id, rating, comment, created_at

#### cart_items
- id, user_id, product_id, variant_id, quantity, created_at

#### addresses
- id, user_id, name, phone, street, barangay, city, postal_code, is_default

---

### 5.4 WebSocket Implementation

#### Technology Stack
- **Laravel WebSockets** or **Pusher**
- **Laravel Broadcasting**

#### Channels
- `orders.{userId}` - Customer order updates
- `shop.{shopId}.orders` - Seller new orders
- `shop.{shopId}.reviews` - Seller new reviews

#### Events
- `OrderStatusUpdated`
- `NewOrderReceived`
- `OrderRejected`
- `ProductReviewed`
- `LowStockAlert`

---

## 6. Design Patterns & Best Practices

### 6.1 Code Quality

#### Constants
- No magic numbers
- Use `UPPERCASED` constants
```typescript
const MAX_CART_ITEMS = 50;
const MIN_ORDER_AMOUNT = 100;
const DEFAULT_PAGE_SIZE = 20;
```

#### Naming Conventions
- Clear, descriptive names
- Reveal intent
```typescript
// ❌ Bad
function getUser() { }

// ✅ Good
function fetchAuthenticatedUserProfile() { }
```

#### Early Returns
```typescript
// ✅ Good
function processOrder(order: Order) {
  if (!order.items.length) return;
  if (order.total < MIN_ORDER_AMOUNT) return;
  
  // Process order logic
}
```

---

### 6.2 Error Handling

#### Frontend
- Toast notifications for user-facing errors
- Console logging for debugging
- Fallback UI for failed data fetches

#### Backend
- Validation errors (422) with detailed messages
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500) with generic message to user

---

### 6.3 Performance Optimization

#### Frontend
- Lazy loading images
- Code splitting (route-based)
- Debounced search input
- Virtualized lists for long product grids
- Optimistic UI updates

#### Backend
- Database indexing (product slugs, order numbers, user emails)
- Eager loading relationships (avoid N+1 queries)
- Query result caching (Redis)
- API rate limiting

---

## 7. Future Enhancements

### Phase 1 (Post-MVP)
- [ ] Payment gateway integration (GCash, PayMaya)
- [ ] Guest checkout
- [ ] Wishlist functionality
- [ ] Advanced search with filters
- [ ] Product recommendations
- [ ] Email notifications
- [ ] Saved addresses
- [ ] Discount codes/promotions

### Phase 2
- [ ] Seller analytics dashboard
- [ ] Multi-variant products (size + color)
- [ ] Follow shop feature
- [ ] Review moderation
- [ ] Seller verification badges
- [ ] Advanced shipping options
- [ ] Inventory forecasting

### Phase 3
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Live chat support
- [ ] Multi-language support
- [ ] Seller subscription tiers

---

## 8. System States

### Empty States
- **Empty Cart:** "Your cart is empty" + "Browse Products" CTA
- **No Orders:** "You haven't placed any orders yet" + "Start Shopping" CTA
- **No Products (Seller):** "You haven't added any products yet" + "Add Product" CTA
- **No Reviews:** "No reviews yet" + "Be the first to review"
- **No Search Results:** "No products found for '{term}'" + suggestions

### Loading States
- **Skeleton Loaders:** Product grids, order lists, shop pages
- **Button Loading:** Spinners on "Add to Cart", "Place Order", "Save"
- **Page Loading:** Full-page spinner for route transitions
- **Infinite Scroll:** Loading indicator at bottom of lists

### Error States
- **Network Error:** "Something went wrong. Please try again."
- **Form Validation:** Inline error messages (red text below fields)
- **Payment Failed:** Error message + "Retry" button
- **Unauthorized:** Redirect to login with "Please log in to continue"
- **404 Not Found:** "Page not found" + "Go Home" button
- **500 Server Error:** "We're experiencing technical difficulties. Please try again later."

---

## 9. Key Improvements & Recommendations

### ✅ Strengths
1. **Unified account system** - Simplifies user experience
2. **Clear role separation** - Customer vs. Seller modes
3. **Comprehensive order flow** - Well-defined status progression
4. **Real-time notifications** - WebSocket for instant updates
5. **Caching strategy** - TanStack Query for performance

### 🔧 Suggested Improvements

#### 1. **Cart Grouping by Shop**
**Current:** Cart items listed individually  
**Improvement:** Group cart items by shop for better organization
- Easier to see which items come from which shop
- Calculate shipping per shop
- Allow checkout per shop (partial checkout)

#### 2. **Product Variant Handling**
**Current:** Basic variant support  
**Improvement:** Enhanced variant management
- Support multiple variant types (Size + Color)
- Variant-specific images
- Variant stock tracking
- Clearer variant selection UI

#### 3. **Order Cancellation Policy**
**Current:** Customer can cancel before "Delivering"  
**Improvement:** More granular cancellation rules
- Allow cancellation only within X hours of order placement
- Require seller approval for cancellations after "Approved" status
- Implement cancellation fees (if applicable)

#### 4. **Search Functionality**
**Current:** Basic search  
**Improvement:** Enhanced search capabilities
- Search suggestions/autocomplete
- Recent searches
- Search filters (category, price, rating)
- Search history for logged-in users
- Typo tolerance

#### 5. **Admin Approval Process**
**Current:** Admin manually approves all orders  
**Improvement:** Automated approval with manual review for flagged orders
- Auto-approve orders that meet criteria (verified users, normal amounts)
- Flag suspicious orders for manual review
- Reduce admin workload

#### 6. **Seller Onboarding**
**Current:** Simple shop creation form  
**Improvement:** Guided onboarding process
- Step-by-step wizard
- Requirements checklist
- Sample products/templates
- Tutorial/help documentation

#### 7. **Review System**
**Current:** Basic star rating + text  
**Improvement:** Enhanced review features
- Review images (customers upload product photos)
- Verified purchase badge
- Helpful votes (upvote/downvote)
- Seller responses to reviews
- Review moderation (flag inappropriate reviews)

#### 8. **Notification Preferences**
**Current:** All notifications enabled  
**Improvement:** User-controlled notification settings
- Toggle email notifications
- Toggle push notifications
- Choose notification types (orders, promotions, reviews)
- Quiet hours (no notifications during certain times)

#### 9. **Product Discovery**
**Current:** Basic product listing  
**Improvement:** Enhanced discovery features
- Featured products section
- "New Arrivals" section
- "Trending Now" based on views/sales
- Category-specific landing pages
- Personalized recommendations

#### 10. **Mobile Responsiveness**
**Current:** Responsive design  
**Improvement:** Mobile-first optimizations
- Bottom navigation for mobile
- Swipe gestures (swipe to delete cart items)
- Touch-optimized buttons (larger tap targets)
- Mobile-specific layouts
- Progressive Web App (PWA) features

---

## 10. Critical Considerations

### 🚨 Must Address

#### 1. **Stock Management**
- **Issue:** Race condition when multiple users order last item
- **Solution:** Implement optimistic locking or reserve stock during checkout

#### 2. **Payment Verification (COD)**
- **Issue:** How to verify COD payments?
- **Solution:** 
  - Delivery personnel confirms payment upon delivery
  - Update order status to "Paid" after confirmation
  - Track unpaid COD orders

#### 3. **Delivery Area Validation**
- **Issue:** Orders outside Pinamungajan-Balamban area
- **Solution:**
  - Validate address during checkout
  - Maintain list of valid barangays
  - Reject orders outside service area

#### 4. **Seller Payout System**
- **Issue:** How do sellers receive payment?
- **Solution (Future):**
  - Track seller earnings
  - Implement payout schedule (weekly/monthly)
  - Integrate with payment providers (GCash, bank transfer)

#### 5. **Dispute Resolution**
- **Issue:** Customer claims non-delivery or damaged goods
- **Solution:**
  - Implement dispute/refund system
  - Require evidence (photos)
  - Admin mediation
  - Clear refund policy

#### 6. **Data Privacy & Security**
- **Issue:** Handling sensitive customer data
- **Solution:**
  - HTTPS only
  - Encrypt sensitive data
  - GDPR-compliant (if applicable)
  - Clear privacy policy
  - Secure password storage (bcrypt)

---

## 11. Success Metrics

### Customer Metrics
- **Conversion Rate:** Visitors → Purchases
- **Cart Abandonment Rate:** % of carts not checked out
- **Average Order Value (AOV)**
- **Customer Retention Rate:** Repeat purchases
- **Customer Satisfaction:** Review ratings

### Seller Metrics
- **Active Sellers:** Number of shops with products
- **Average Products per Shop**
- **Seller Response Time:** Time to approve/process orders
- **Seller Rating:** Average shop ratings

### Platform Metrics
- **Total Orders:** Daily/Weekly/Monthly
- **Total Revenue:** Platform-wide sales
- **Order Fulfillment Rate:** % of orders completed
- **Average Delivery Time:** Order → Delivery

---

## Conclusion

This unified flow document combines the best of your user preferences and existing UI flow, providing a comprehensive blueprint for the Icon Shoppers platform. The system is designed to be:

- **Simple:** Easy to use for both customers and sellers
- **Robust:** Well-defined flows and error handling
- **Scalable:** Architecture supports future enhancements
- **Local-focused:** Tailored for Pinamungajan-Balamban region

**Next Steps:**
1. Review and approve this unified flow
2. Create detailed API documentation
3. Design database schema
4. Build wireframes/mockups
5. Begin MVP development

---

*For questions or clarifications, refer to the [AGENTS.md](../AGENTS.md) guidelines.*
