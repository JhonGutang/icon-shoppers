# 🛒 Icon Shoppers
> **Empowering Local Communities through Technology.**

Icon Shoppers is a hyper-local e-commerce platform specifically designed for the **Pinamungajan to Balamban** region. Our mission is to bridge the gap between local producers (farmers, artisans, and small business owners) and the community by providing a robust, simplified shopping experience powered by modern technology.

---

## 🌟 Why Icon Shoppers?

In a world where digital transformation is rapid, local communities often get left behind. We created this project to:
1.  **Showcase Local Talent:** Provide a dedicated space for local products and farmers to reach a wider audience within their region.
2.  **Enforce Tech Adoption:** Encourage both merchants and customers to embrace digital tools, improving efficiency and documentation in local trade.
3.  **Support Local Economy:** By focusing on a specific region, we ensure that growth and circulation of resources stay within the community.

---

## ✨ Key Features

### 🏪 For Merchants (Shops)
-   **Shop Management:** Easy registration and personalized shop profiles.
-   **Product Lifecycle:** Upload products with images, set pricing, and manage stock levels in real-time.
-   **Order Fulfillment:** A streamlined dashboard to approve, process, and track orders from placement to completion.
-   **Analytics:** Basic overview of product performance and order history.

### 🛍️ For Customers
-   **Local Discovery:** Browse featured products and shops within the Pinamungajan to Balamban area.
-   **Persistent Shopping Cart:** Save items across sessions for a seamless checkout experience.
-   **Order Tracking:** Monitor the status of your orders in real-time.
-   **Secure Authentication:** Managed via Sanctum for a reliable and safe login experience.
-   **Feedback System:** Rate and review products to help the community make informed choices.

---

## 🛠️ Technologies Used

Icon Shoppers is built with a modern, scalable stack:

### **Backend**
-   **Framework:** [Laravel 12](https://laravel.com/)
-   **Authentication:** Laravel Sanctum
-   **Testing:** Pest PHP
-   **Architecture:** Service-Repository Pattern for clean, maintainable logic.

### **Frontend**
-   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
-   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
-   **Components:** [Shadcn UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
-   **State Management:** Zustand
-   **Icons:** Lucide React

### **Infrastructure**
-   **Database:** SQLite (Development), PostgreSQL (Production)
-   **Deployment:** Ready for Railway/Vercel.

---

## 🚀 Getting Started

### Prerequisites
-   PHP 8.2+ & Composer
-   Node.js 20+ & npm

### Installation

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/JhonGutang/icon-shoppers.git
    cd icon-shoppers
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    composer install
    cp .env.example .env
    php artisan key:generate
    touch database/database.sqlite
    php artisan migrate --seed
    php artisan serve
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    cp .env.example .env.local
    npm run dev
    ```

4.  **Access the Application:**
    -   Frontend: `http://localhost:3000`
    -   Backend API: `http://localhost:8000`

---

## 🛡️ Project Standards

For detailed information on our coding standards, naming conventions, and architectural rules, please refer to the [AGENTS.md](file:///c:/Users/jhonb/Documents/Websites/icon-shoppers/AGENTS.MD) file.

---

## 💳 Payment Policy
Icon Shoppers strictly enforces **Cash on Delivery (COD)** to ensure simplicity and trust within the local community.