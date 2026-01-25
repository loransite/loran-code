# Frontend-Backend Connection Fix

## Problem
Frontend (Vercel) is not connecting to Backend (Render) because environment variables are not configured.

## Solution

### Step 1: Set Vercel Environment Variable

1. Go to: https://vercel.com/dashboard
2. Select your `loran-code` project
3. Click **Settings** → **Environment Variables**
4. Add this variable:
   - **Name:** `NEXT_PUBLIC_BACKEND_URL`
   - **Value:** `https://loran-code.onrender.com`
   - **Environments:** Check all three (Production, Preview, Development)
5. Click **Save**

### Step 2: Set Render Environment Variable

1. Go to: https://dashboard.render.com/
2. Select your `loran-code` service
3. Click **Environment** in the left sidebar
4. Click **Add Environment Variable**
5. Add:
   - **Key:** `FRONTEND_URL`
   - **Value:** `https://loran-code.vercel.app`
6. Click **Save Changes**

### Step 3: Redeploy Both Services

**Render (Backend):**
- Render will automatically redeploy when you save the environment variable
- Wait 2-3 minutes for deployment to complete

**Vercel (Frontend):**
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (unchecked)
5. Click **Redeploy**

### Step 4: Test the Connection

After both services finish redeploying (wait 3-5 minutes):

1. Open: https://loran-code.vercel.app
2. Press **F12** to open browser DevTools
3. Go to **Console** tab
4. Type and press Enter:
   ```javascript
   fetch('https://loran-code.onrender.com/health').then(r => r.json()).then(console.log)
   ```
5. You should see:
   ```json
   {
     "status": "healthy",
     "timestamp": "...",
     "uptime": ...,
     "environment": "production"
   }
   ```

If you see this response, the connection is working! ✅

### Step 5: Test Login/Signup

Try creating a new account or logging in on your frontend. If it works, everything is connected properly.

---

## Why This Happened

- **Frontend** uses `NEXT_PUBLIC_BACKEND_URL` to know where the API is. Without it, it falls back to `http://localhost:5000`
- **Backend** uses `FRONTEND_URL` for CORS to allow requests from your frontend domain
- Environment variables set locally (in `.env` files) don't automatically transfer to hosting platforms

## Quick Verification

**Check if Vercel has the variable:**
- Go to Vercel → Settings → Environment Variables
- Look for `NEXT_PUBLIC_BACKEND_URL`

**Check if Render has the variable:**
- Go to Render → Environment
- Look for `FRONTEND_URL`

If either is missing or has the wrong value, that's your issue!
