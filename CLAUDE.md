# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Icon Shoppers** is a hyper-local e-commerce platform for the Pinamungajan to Balamban region. It's a full-stack application supporting local producers (farmers, artisans, small business owners) with a robust shopping experience. Payment method: **Cash on Delivery (COD) only**.

### Tech Stack
- **Backend:** Laravel 12, PHP 8.2+, Sanctum (auth), Reverb (real-time), Pest (testing), Pint (linting)
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Shadcn UI, Zustand, Tanstack Query
- **Database:** SQLite (dev), PostgreSQL (prod)

---

## Development Commands

### Backend

```bash
cd backend

# Development server (includes queue listener, all processes via concurrently)
composer dev

# Code quality
composer lint                 # Run Pint linter (use pint --fix to auto-fix)
composer test                 # Run Pest test suite
composer test path/to/test    # Run single test file

# Key artisan commands
php artisan migrate           # Run migrations
php artisan migrate --seed    # Run with seeders
php artisan tinker           # Interactive shell
php artisan queue:listen     # Listen to queued jobs
```

### Frontend

```bash
cd frontend

# Development (uses Turbopack)
npm run dev

# Building & quality
npm run build                 # Production build
npm run start                 # Start production server
npm run lint                  # Run ESLint
npm run type-check           # TypeScript type checking
npm run test                 # Run Vitest suite
npm run ci                   # All checks: lint → type-check → test → build
```

### Full Development Environment
From root directory:
```bash
cd backend
composer dev   # Runs: Laravel server + queue listener + frontend dev
```

---

## Code Architecture

### Backend (Service-Repository Pattern)

Follow this flow strictly:
```
Form Request → Controller → Service → Repository → Model
```

**Key conventions:**
- **Form Request:** All validation & authorization
- **Controller:** Thin orchestration layer only
- **Service:** Business logic (e.g., `ProductService`, `CartService`)
- **Repository:** Data persistence & complex queries (implements `RepositoryInterface`)
- **Model:** Eloquent model definitions & relationships only
- **Global Folders:**
  - `app/Interfaces/` — Repository and Service interfaces (Dependency Injection)
  - `app/DTO/` — Data Transfer Objects (e.g., `CartItemDTO`, `OrderDTO`)
  - `config/` — System & third-party configuration
  - `libs/` — External library wrappers
  - `utils/` — Generic helper functions
  - `tests/` — Pest test files

**Key Models:**
- `User` — Unified auth; users can become merchants by creating a `Shop`
- `Shop` — Auto-generates URL-friendly slugs via `boot()` method
- `Product` — Product lifecycle with variants
- `Cart` / `CartItem` — Persistent shopping cart
- `Order` / `OrderItem` — Order fulfillment workflow
- `Message` / `Conversation` — Real-time chat via Reverb
- `ProductRating` / `ShopRating` — Feedback system

**Real-time Features:**
- Uses Laravel Reverb + Pusher for broadcasts on private channels (authorized via Sanctum)
- Notifications: `NewMessageNotification`, `OrderPlacedNotification`, `OrderStatusChangedNotification`

### Frontend (Next.js App Router)

**Structure:**
- `app/` — Pages (Next.js App Router)
- `components/` — React components, organized by feature:
  - `auth/` — Login, register, role selection
  - `customer-home/` — Customer dashboard sections
  - `shop/` — Seller dashboard sections
  - `product/` — Product display & management
  - `shared/` — Reusable utilities, UI base components (Shadcn exports), context
  - `shared/ui/` — Shadcn UI component exports (do NOT create custom replacements)
- `hooks/` — Custom React hooks, organized by feature:
  - `product/` — `useProductsQuery`, `useProductActions`
  - `customer/` — `useCustomerActions`, `useWishlistMutations`
  - `shop/` — `useShopAnalytics`
  - `shared/` — `useAxios` (centralized API client), `useDebounce`, `useRedirectLink`
- `services/` — API interaction logic, state management via Zustand
- `utils/` — Formatters, helpers (e.g., currency formatting)
- `config/` — Environment-specific settings
- `constants/` — Query keys (`queryKeys.ts`), constants

**Key Conventions:**
- **Centralized API:** All API calls through `useAxios()` hook (enforces auth headers, single client instance)
- **State Management:** Zustand for global state (auth, cart, etc.)
- **Data Fetching:** Tanstack Query (`useInfiniteQuery` for lists, `useQuery` for single items)
- **UI Components:** Use **only** Shadcn UI exports from `components/shared/ui/` — do NOT create custom UI components that replicate Shadcn functionality
- **TypeScript:** All data structures typed via interfaces (API responses, props, state). Never use `any`.
- **Protected Routes:** See `frontend/src/docs/PROTECTED_ROUTES.md` for auth flow

---

## Key Architectural Decisions

### Unified Authentication System
- Single user account system. Any user can become a merchant by creating a `Shop`.
- Removed legacy `shop-api` guard, separate auth routes, and redundant redirects.
- Reference: [Compounding Knowledge - 2026-01-26](AGENTS.md#-compounding-knowledge)

### Cart Endpoint Naming
- Cart operations use dedicated endpoints: `DELETE /cart-item/{id}` (not `DELETE /order/{id}`)
- Frontend service (`customerService.ts`) and hooks (`useCustomerActions.ts`) updated accordingly.

### Shop Slug Auto-Generation
- Existing shops with null slugs are auto-populated via data migration
- `Shop::boot()` ensures all new shops generate URL-friendly slugs automatically
- Always verify slug generation for models with slug-based routing

### Real-time Features (Reverb)
- Private channel broadcasts for messages, notifications, order status updates
- Authorized via Sanctum on protected channels
- Frontend uses `laravel-echo` + `pusher-js` to listen for broadcasts

### Infinite Scrolling
- Product, shop, and message lists use `useInfiniteQuery` for better performance
- Centralized in `useProductsQuery` and `useShopsQuery` hooks

---

## Standards & Best Practices

### Naming Conventions
- Avoid abbreviations: `fetchUserData` not `getUser`
- Use UPPERCASE for constants: `const MAX_ORDER_AMOUNT = 5000;`
- Reveal intent in names

### Code Quality
- **DI & DIP:** Always inject dependencies; use interfaces for decoupling
- **SRP:** One reason to change per class/function
- **Early Returns:** Prefer `if (!condition) return;` over deep nesting
- **Comments:** Only for complex logic; prefer self-documenting code
- **Type Safety:** Always define interfaces/types; avoid `any`

### Testing & CI
- Backend: Pest PHP with architecture tests (`pestphp/pest-plugin-arch`)
- Frontend: Vitest with Testing Library
- **Do NOT modify existing tests** unless absolutely necessary for the fix/feature
- CI pipeline: `composer ci` (backend) and `npm run ci` (frontend)

### Final Checks Before Commit
1. Type checking passes (`tsc --noEmit` frontend, Pest backend)
2. Build succeeds (`npm run build` frontend)
3. Linting passes (`eslint` frontend, `pint` backend)
4. Tests pass (`npm run test` frontend, `composer test` backend)
5. Documentation updated (README, internal docs)

---

## Workflow (Reference AGENTS.md)

1. **Clarification:** Ask questions if context is confusing
2. **Planning:** Create detailed plan; get approval before coding
3. **Implementation:** Follow standards above
4. **Testing:** Write comprehensive tests; don't modify existing ones
5. **Type Check & Build Check:** Run full type check + build process
6. **Documentation:** Update README or internal docs after implementation
7. **Record Learnings:** Document in [Compounding Knowledge](AGENTS.md#-compounding-knowledge) to prevent repetition

---

## Common Tasks

### Add a New API Endpoint (Backend)
1. Create **Form Request** (`app/Http/Requests/YourRequest.php`) for validation
2. Create or extend **Controller** (`app/Http/Controllers/YourController.php`)
3. Implement **Service** (`app/Services/YourService.php`)
4. Implement **Repository** (`app/Repositories/YourRepository.php`) with interface
5. Extend **Model** (`app/Models/Your.php`) with relationships
6. Register routes in `routes/api.php`
7. Write **Pest tests** in `tests/Feature/YourTest.php`

### Add a New Frontend Page
1. Create page file in `app/` directory (e.g., `app/your-page/page.tsx`)
2. Use **protected routes** if needed (see `components/shared/auth/ProtectedRoute.tsx`)
3. Create **custom hook** in `hooks/` for data fetching (Tanstack Query)
4. Build UI using **Shadcn components** from `components/shared/ui/`
5. Ensure **TypeScript types** for all props and API responses
6. Write **Vitest tests** for hooks and components

### Fetch Data on Frontend
```typescript
// Use centralized axios client via useAxios hook
const { api } = useAxios();

// For queries: Tanstack Query
const { data } = useQuery({
  queryKey: [QUERY_KEY],
  queryFn: () => api.get('/endpoint'),
});

// For infinite lists: useInfiniteQuery
const { data, fetchNextPage } = useInfiniteQuery({
  queryKey: [QUERY_KEY],
  queryFn: ({ pageParam = 1 }) => api.get(`/endpoint?page=${pageParam}`),
  getNextPageParam: (lastPage) => lastPage.nextPage,
});
```

### Run Tests
```bash
# Backend - all tests
composer test

# Backend - single test file
composer test tests/Feature/ProductTest.php

# Backend - specific test
composer test --filter testCreateProduct

# Frontend - all tests
npm run test

# Frontend - watch mode
npm run test -- --watch

# Frontend - specific file
npm run test -- hooks/product/useProductsQuery.test.ts
```

---

## Debugging & Tools

- **Backend:** `php artisan tinker` for interactive exploration
- **Frontend:** Browser DevTools, React DevTools extension, TanstackQuery DevTools (visible in dev)
- **Database:** SQLite in dev (`database/database.sqlite`), or inspect via `php artisan tinker`
- **API Testing:** Use Postman/Insomnia; auth via Sanctum token in headers

---

## Important Files & References

- **[AGENTS.md](AGENTS.md)** — System guidelines, coding standards, compounding knowledge
- **[README.md](README.md)** — Project overview, features, setup instructions
- **[frontend/src/docs/PROTECTED_ROUTES.md](frontend/src/docs/PROTECTED_ROUTES.md)** — Auth flow & protected routes
- **[backend/routes/api.php](backend/routes/api.php)** — API route definitions
- **[frontend/src/constants/queryKeys.ts](frontend/src/constants/queryKeys.ts)** — Tanstack Query cache keys
- **[backend/app/Providers/AppServiceProvider.php](backend/app/Providers/AppServiceProvider.php)** — Dependency injection bindings
