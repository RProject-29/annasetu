# 🚀 AnnaSetu — Production Deployment Guide

AnnaSetu is configured and verified to deploy in two flexible modes:
- **Option 1 (Recommended / Easiest)**: Full-Stack All-in-One on **Render**, **Railway**, or a VPS.
- **Option 2**: Decoupled deployment with Frontend on **Vercel / Netlify** and Backend on **Render / Railway**.

---

## 📋 Pre-Flight Checklist

| Check | Status | Details |
| :--- | :---: | :--- |
| **Client Production Build** | ✅ Passed | Vite creates optimized static bundle with chunking |
| **Backend API Health Check** | ✅ Passed | Node.js Express server starts cleanly |
| **Database Resiliency** | ✅ Passed | Auto-detects MongoDB Atlas; seamless fallback to FileDB |
| **CORS & Origin Handling** | ✅ Configured | Server accepts production client origins |
| **SPA Route Rewrites** | ✅ Configured | `client/vercel.json` and Express wildcard handler ready |
| **Secrets & Ignores** | ✅ Protected | `.gitignore` at root and server blocks `.env` & `node_modules` |

---

## 🛠️ Step 0: Initialize Git (If not already initialized)

Run this once inside the project root folder `c:\Users\LENOVO\Desktop\AanSetu`:

```bash
cd c:\Users\LENOVO\Desktop\AanSetu
git init
git add .
git commit -m "feat: production ready deployment configuration"
```

Push this to your GitHub repository:
```bash
git remote add origin https://github.com/<your-username>/annasetu.git
git branch -M main
git push -u origin main
```

---

## 🌐 Option 1: Full-Stack All-in-One on Render (Recommended)

In this mode, a single web service serves both the React UI and the REST API.

1. Go to [Render.com](https://render.com) and log in.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure the settings:
   - **Name**: `annasetu`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users (e.g., Singapore / Frankfurt)
   - **Branch**: `main`
   - **Build Command**: `npm install --prefix server && npm install --prefix client && npm run build`
   - **Start Command**: `npm start`
5. **Environment Variables**:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `PORT` | `10000` | (Render sets this automatically) |
   | `MONGODB_URI` | `mongodb+srv://...` | *(Optional)* MongoDB Atlas connection string |
6. Click **Deploy Web Service**.

Your full AnnaSetu app (Frontend + Backend + Real-time Corridors) will be live on a single URL like `https://annasetu.onrender.com`.

---

## ⚡ Option 2: Decoupled (Vercel + Render)

### Part A: Deploy Server on Render
1. Create a new **Web Service** on Render from your repository.
2. Settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: Your MongoDB Atlas URI
   - `CLIENT_ORIGIN`: Your Vercel frontend URL (or `*`)
4. Copy your backend URL (e.g. `https://annasetu-backend.onrender.com`).

### Part B: Deploy Frontend on Vercel
1. Go to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Select your repository.
3. Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
4. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://annasetu-backend.onrender.com` (your backend URL from Part A)
5. Click **Deploy**.

---

## 🗄️ Database Setup (MongoDB Atlas — Free Tier)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. Go to **Network Access** → Add IP Address → Click **Allow Access from Anywhere** (`0.0.0.0/0`).
3. Go to **Database Access** → Add a Database User (keep credentials handy).
4. Click **Connect** → **Drivers** → Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/annasetu?retryWrites=true&w=majority
   ```
5. Paste this into your server's `MONGODB_URI` environment variable.

---

## 🧪 Local Production Verification Test

You can test the exact production bundle locally anytime:

```bash
# 1. Build the production client
npm run build

# 2. Run the production server
npm start
```
Then open `http://localhost:5000` in your browser.
