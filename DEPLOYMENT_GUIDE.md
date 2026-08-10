# Deployment Guide: Backend on Render & Frontend on Vercel

Follow these steps to deploy your Portfolio application with the backend on **Render** and the frontend on **Vercel**.

---

## Step 1: Deploy Backend & PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/) and log in.
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository (`aswin669/portfolio`).
4. Select the repository and click **Apply**.
   - Render will automatically create:
     - Managed PostgreSQL database (`portfolio-db`)
     - Web Service (`portfolio-backend`)
5. Once deployment completes, copy your Render Web Service URL (e.g. `https://portfolio-backend-xxxx.onrender.com`).

---

## Step 2: Deploy Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and log in.
2. Click **Add New...** → **Project**.
3. Import your GitHub repository (`aswin669/portfolio`).
4. In the **Environment Variables** section, add:
   - `BACKEND_URL` = `https://portfolio-backend-xxxx.onrender.com` (Your Render URL from Step 1)
   - `NEXT_PUBLIC_API_URL` = `https://portfolio-backend-xxxx.onrender.com`
5. Click **Deploy**.

---

## Architecture Flow

```
[ User Browser ]
       │
       ▼
 [ Vercel Frontend ] ── (Rewrites /api/*) ──► [ Render Backend ]
                                                    │
                                                    ▼
                                           [ Render PostgreSQL DB ]
```
