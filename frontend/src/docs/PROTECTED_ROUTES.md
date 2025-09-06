# Protected Routes Implementation

This document explains the protected routes system implemented for the Icon Shoppers application.

## Overview

The application now has a comprehensive route protection system that ensures users can only access routes appropriate for their role (customer or seller).

## Components Created

### 1. ProtectedRoute Component
**Location:** `frontend/src/components/ProtectedRoute.tsx`

A reusable component that wraps routes and provides authentication and authorization checks.

**Props:**
- `children`: React.ReactNode - The content to protect
- `allowedRoles`: string[] - Array of roles that can access this route (optional)
- `redirectTo`: string - Where to redirect unauthorized users (optional)
- `requireAuth`: boolean - Whether authentication is required (default: true)

**Usage:**
```tsx
<ProtectedRoute allowedRoles={["customer"]} redirectTo="/customer-auth">
  <YourComponent />
</ProtectedRoute>
```

### 2. Layout Components

#### CustomerLayout
**Location:** `frontend/src/layout/CustomerLayout.tsx`
- Protects routes for customers only
- Redirects to `/customer-auth` if not authenticated or wrong role

#### SellerLayout
**Location:** `frontend/src/layout/SellerLayout.tsx`
- Protects routes for sellers only
- Redirects to `/shop-auth` if not authenticated or wrong role

#### PublicLayout
**Location:** `frontend/src/layout/PublicLayout.tsx`
- For public routes that don't require authentication
- Allows both authenticated and non-authenticated users

### 3. useRouteProtection Hook
**Location:** `frontend/src/hooks/useRouteProtection.ts`

A custom hook for programmatic route protection.

**Parameters:**
- `allowedRoles`: string[] - Roles that can access the route
- `redirectTo`: string - Redirect destination for unauthorized users
- `requireAuth`: boolean - Whether authentication is required

**Returns:**
- `isAuthenticated`: boolean
- `userType`: string | null
- `hasHydrated`: boolean
- `canAccess`: boolean

### 4. Enhanced Auth Store
**Location:** `frontend/src/stores/useAuthStore.ts`

Added helper methods:
- `isAuthenticated()`: Returns true if user has access token
- `isCustomer()`: Returns true if user is a customer
- `isSeller()`: Returns true if user is a seller
- `hasRole(role)`: Returns true if user has the specified role

## Route Protection Implementation

### Customer-Only Routes
- `/home` - Customer dashboard and shopping interface
- `/home?section=Cart` - Shopping cart
- `/home?section=Check+Orders` - Order history
- `/home?section=My+Account` - Customer account management

### Seller-Only Routes
- `/profile` - Seller profile and product management
- `/dashboard` - Order management dashboard
- `/profile/[id]` - Individual product management

### Public Routes
- `/` - Landing page
- `/customer-auth` - Customer authentication
- `/shop-auth` - Seller authentication
- `/[shopName]` - Shop browsing (public)
- `/[shopName]/[productName]` - Product viewing (public)

## How It Works

1. **Authentication Check**: The system checks if the user has a valid access token
2. **Role Verification**: If specific roles are required, it verifies the user's role
3. **Redirect Logic**: Unauthorized users are redirected to appropriate authentication pages
4. **Loading States**: Shows loading spinner while checking authentication status
5. **Toast Notifications**: Displays error messages for unauthorized access attempts

## Usage Examples

### Protecting a New Customer Route
```tsx
// frontend/src/app/new-customer-page/page.tsx
import CustomerLayout from "@/layout/CustomerLayout";

const NewCustomerPage = () => {
  return (
    <CustomerLayout>
      <div>Customer-only content here</div>
    </CustomerLayout>
  );
};

export default NewCustomerPage;
```

### Protecting a New Seller Route
```tsx
// frontend/src/app/new-seller-page/page.tsx
import SellerLayout from "@/layout/SellerLayout";

const NewSellerPage = () => {
  return (
    <SellerLayout>
      <div>Seller-only content here</div>
    </SellerLayout>
  );
};

export default NewSellerPage;
```

### Custom Protection with Hook
```tsx
// frontend/src/app/mixed-access/page.tsx
import { useRouteProtection } from "@/hooks/useRouteProtection";

const MixedAccessPage = () => {
  const { canAccess, isAuthenticated, userType } = useRouteProtection({
    allowedRoles: ["customer", "seller"],
    requireAuth: true
  });

  if (!canAccess) {
    return <div>Access denied</div>;
  }

  return (
    <div>
      <h1>Welcome, {userType}!</h1>
      {/* Your content here */}
    </div>
  );
};

export default MixedAccessPage;
```

### Public Route (No Authentication Required)
```tsx
// frontend/src/app/public-page/page.tsx
import PublicLayout from "@/layout/PublicLayout";

const PublicPage = () => {
  return (
    <PublicLayout>
      <div>Anyone can see this content</div>
    </PublicLayout>
  );
};

export default PublicPage;
```

## Benefits

1. **Centralized Protection**: All route protection logic is in one place
2. **Role-Based Access**: Easy to specify which roles can access which routes
3. **Reusable Components**: Layout components can be reused across similar routes
4. **Better UX**: Loading states and proper redirects
5. **Type Safety**: TypeScript support for role checking
6. **Maintainable**: Easy to add new roles or modify access rules
7. **Consistent**: Uniform protection across all routes

## Security Notes

- Authentication state is persisted in localStorage via Zustand
- Tokens are checked on every route access
- Role verification happens client-side (backend should also verify)
- Redirects prevent unauthorized access to protected content
- Loading states prevent flash of unauthorized content

## Future Enhancements

1. **Server-Side Protection**: Implement middleware for server-side route protection
2. **Permission-Based Access**: More granular permissions beyond just roles
3. **Session Management**: Automatic token refresh and session timeout
4. **Audit Logging**: Track access attempts and unauthorized access
5. **Multi-Factor Authentication**: Enhanced security for sensitive routes
