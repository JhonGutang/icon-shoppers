# AGENTS.md - System Guidelines & Standards

This document serves as the primary source of truth for all AI agents and developers working on the `icon-shoppers` project. Adherence to these rules is mandatory to ensure consistency, scalability, and maintainability.

---

## 🚀 Project Overview

**Project Name:** Icon Shoppers
**Scope:** Local e-commerce platform limited to the **Pinamungajan to Balamban** region.
**Focus:** Supporting local products and farmers.
**Payment Method:** Strictly **Cash on Delivery (COD)** only.
**Goal:** Provide a robust, simplified shopping experience that empowers local communities.

---

## 🎨 Coding Style & Best Practices

1.  **Magic Numbers:** 
    - Never use hardcoded numbers. Use `UPPERCASED` constant variables.
    - *Example:* `const MAX_ORDER_AMOUNT = 5000;`
2.  **Naming Conventions:** 
    - Names must be clear, descriptive, and reveal intent.
    - Avoid abbreviations. Use `fetchUserData` instead of `getUser`.
3.  **Abstraction & Architecture:**
    - **Dependency Injection (DI) & Inversion (DIP):** Always inject dependencies to allow for easier testing and decoupling.
    - **Stairway Pattern:** Organize levels of abstraction clearly. Higher-level modules should depend on abstractions, not details.
    - **Single Responsibility Principle (SRP):** Each class or function should have one reason to change.
    - **Early Returns:** Prefer `if (!condition) return;` to avoid deep nesting.
4.  **Frontend (Shadcn UI):**
    - Strictly use Shadcn components for UI consistency.
    - Do not create custom components that replicate Shadcn functionality.
5.  **Type Safety:**
    - Always use TypeScript. Define interfaces/types for all data structures (API responses, props, state).
    - Avoid `any` at all costs.
6.  **Comments:**
    - Ensure that comments are written only for complex codes.
    - Strongly suggest to not write comments if possible; prefer self-documenting code.

---

## 🏗️ System Architecture

### 🛡️ Backend (Laravel/PHP)
Follow this flow strictly:
`Form Request` ➔ `Controller` ➔ `Service` ➔ `Repository` ➔ `Model`

- **Form Request:** Handle all validation and authorization.
- **Controller:** Orchestrate the flow; keep them "thin."
- **Service:** House business logic.
- **Repository:** Handle data persistence and complex queries.
- **Model:** Basic Eloquent model definitions and relationships.
- **Global Folders:**
    - `config/`: System and third-party configuration.
    - `libs/`: External libraries or wrappers.
    - `utils/`: Generic helper functions.

### 🌐 Frontend (Next.js/TypeScript)
- **API Initialization:** All API calls must use a central axial/fetch instance with proper authorization headers.
- **Services:** Logic for API interaction and state management.
- **Global Folders:**
    - `utils/`: UI helpers, formatters (e.g., currency).
    - `config/`: Environment-specific settings.
    - `libs/`: Shared libraries or complex UI logic providers.

---

## 🔄 Workflow

1.  **Clarification:** Ask questions if the context is confusing or requires clarification.
2.  **Planning:** Create a detailed implementation plan and get user approval before writing code.
3.  **Implementation:** Adhere strictly to the rules stated in this document.
4.  **Testing:** Create comprehensive test cases (Pest for backend, Vitest for frontend). **Do not modify existing test cases** unless absolutely necessary for the fix/feature.
5.  **Final Type Check & Build Check:** Run a full type check and build process to ensure no regressions or system-wide errors. This must pass before proceeding.
6.  **Documentation:** Add or update documentation (README, internal docs) after every implementation. Use comments only for complex logic as per project guidelines.
7.  **Compounding Knowledge:** If a mistake is made, record it in the [Compounding Knowledge](#-compounding-knowledge) section to avoid repetition.

---

## 🧠 Compounding Knowledge

*This section is for recording mistakes, edge cases, and architectural lessons learned during development.*

- **2026-01-26 - Unified Auth Implementation:** Shifted from separate customer/shop guards and routes to a single-account system where any user can become a merchant by creating a shop. Cleaned up legacy `shop-api` guard, separate auth pages, and redundant redirects.
- **2026-01-26 - Cart Endpoint Consistency:** Renamed cart deletion route from `DELETE /order/{id}` to `DELETE /cart-item/{id}` for clarity. Cart-related operations should use cart-specific endpoint names. Updated frontend service (`customerService.ts`) and hooks (`useCustomerActions.ts`) accordingly.
- **2026-01-26 - Shop Slug Auto-Generation:** Fixed issue where existing shops had null slugs causing 404 errors. Created data migration to populate slugs from shop names. Shop model's `boot()` method now ensures all new shops auto-generate URL-friendly slugs. Always verify slug generation for models with slug-based routing.
- *(Add new entries here)*

---

## ✅ Final Note
Success is measured by the simplicity and robustness of the system. Strive for code that is easy to read and hard to break.
