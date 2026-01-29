# Deploying Icon Shoppers Frontend to Vercel

This guide outlines the steps to deploy the Next.js frontend to Vercel, ensuring that routing and API proxying work correctly.

## Prerequisites
- A Vercel account.
- The project pushed to a GitHub, GitLab, or Bitbucket repository.
- The Render-hosted backend is active and accessible.

## Step-by-Step Deployment

### 1. Import project in Vercel
1. Log in to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New"** > **"Project"**.
3. Select your repository and click **"Import"**.

### 2. Configure Build Settings
Vercel should automatically detect Next.js. Ensure the settings are as follows:
- **Framework Preset:** Next.js
- **Root Directory:** `frontend` (Since the repo is a monorepo)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

### 3. Environment Variables
Add the following environment variables in the **"Environment Variables"** section:

| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_LARAVEL_API_URL` | `https://icon-shoppers.onrender.com` | Base URL of your backend |

> [!NOTE]
> Even though we use `vercel.json` for proxying, keeping this variable allows for fallback logic or direct calls if ever needed.

### 4. Deploy
1. Click **"Deploy"**.
2. Once the build is finished, your app will be live on a `*.vercel.app` domain.

## Why this configuration works
- **Built-in Rewrites**: Next.js handles routing and API proxying via `next.config.ts`. This avoids conflicts with Vercel's edge network and ensures clean `/api/*` and `/storage/*` requests to Render.
- **Relative BaseURL**: The `axiosInstance` is configured to use `/api/`, which works seamlessly with the Vercel proxy.

## Troubleshooting
- **404 on Refresh:** If refreshing a page like `/cart` results in a 404, double-check that `vercel.json` is present in the `frontend` root and contains the `rewrites` section.
- **API Errors:** Ensure the Render backend is not in "sleep" mode or has the correct CORS headers to accept requests from your Vercel domain.
