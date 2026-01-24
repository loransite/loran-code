# 🚀 Render.com Deployment Guide (No Credit Card Required)

## Why Render?
- ✅ **Free tier available** (750 hours/month)
- ✅ **No credit card required** for free tier
- ✅ Auto-deploy from GitHub
- ✅ Easy setup
- ⚠️ Services sleep after 15 mins of inactivity (wakes up in ~1 minute)

---

## 📋 Prerequisites
1. Render account (sign up at https://render.com)
2. GitHub account with your code
3. MongoDB Atlas account (free tier)
4. Gmail account (for emails)
5. Paystack account (for payments)

---

## 🎯 Deploy Backend on Render

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Add Render config"
git push origin main
```

### Step 2: Create New Web Service

1. **Go to https://render.com**
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select your **loran-code** repository
5. Configure:
   - **Name**: `loran-backend`
   - **Region**: `Oregon (US West)` or closest to you
   - **Branch**: `main`
   - **Root Directory**: `LoranBackend` ⚠️ **Important!**
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lorandb
JWT_SECRET=your_super_secret_32_character_random_string_here
FRONTEND_URL=https://your-frontend.onrender.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@loran.com
PAYSTACK_SECRET_KEY=sk_live_your_paystack_key
BASE_URL=https://loran-backend.onrender.com
MAX_FILE_SIZE=10485760
```

### Step 4: Create Service
- Click **"Create Web Service"**
- Wait 5-10 minutes for deployment
- Your backend will be at: `https://loran-backend.onrender.com`

---

## 🎨 Deploy Frontend on Render

### Option A: Render (Free Tier)

1. Click **"New +"** → **"Web Service"**
2. Select your repository
3. Configure:
   - **Name**: `loran-frontend`
   - **Root Directory**: `loranfrontend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

4. Add Environment Variables:
```env
NEXT_PUBLIC_BACKEND_URL=https://loran-backend.onrender.com
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_SITE_URL=https://loran-frontend.onrender.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_key
NEXT_PUBLIC_ENABLE_AI_TRYON=true
NEXT_PUBLIC_ENABLE_REVIEWS=true
```

### Option B: Vercel (Recommended for Frontend - Faster)

1. Go to https://vercel.com
2. Import your GitHub repository
3. Configure:
   - **Root Directory**: `loranfrontend`
   - **Framework Preset**: `Next.js`
4. Add same environment variables
5. Deploy (takes ~2 minutes)

---

## 🔄 Update CORS After Deployment

Once frontend is deployed, update backend environment variables:

1. Go to Render dashboard → Backend service
2. Update `FRONTEND_URL` to your actual frontend URL
3. Click **"Save Changes"** (auto-redeploys)

---

## ⚙️ Render vs Railway vs GCP

| Feature | Render | Railway | GCP |
|---------|--------|---------|-----|
| **Credit Card** | ❌ No | ✅ Yes | ✅ Yes |
| **Free Tier** | ✅ 750hrs/month | ⚠️ Trial only | ✅ Yes |
| **Auto Sleep** | ✅ Yes (15 min) | ❌ No | Depends |
| **Easy Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Cold Start** | ~30-60 sec | Instant | Depends |
| **Monthly Cost** | Free | $10 | Varies |

---

## 🎯 Recommended Stack:

**Best Free Setup:**
- ✅ **Backend**: Render.com (free tier)
- ✅ **Frontend**: Vercel (free tier)
- ✅ **Database**: MongoDB Atlas (free tier)
- 💰 **Total Cost**: $0/month

**If You Have Credit Card:**
- ⚡ **Backend**: Railway ($5/month)
- ⚡ **Frontend**: Vercel (free)
- ⚡ **Database**: MongoDB Atlas (free)
- 💰 **Total Cost**: $5/month

---

## 📝 Important Notes

### Render Free Tier Limitations:
- Services sleep after 15 minutes of inactivity
- First request after sleep takes ~30-60 seconds (cold start)
- 750 hours/month (enough for 1 service running 24/7)
- Good for testing/development
- Users may experience delay on first visit

### To Prevent Sleep:
Use a service like **UptimeRobot** (free) to ping your app every 10 minutes.

---

## 🐛 Troubleshooting

### Build Fails on Render
```bash
# Check logs in Render dashboard
# Common issues:
- Root Directory not set correctly
- Missing dependencies in package.json
- Node version mismatch
```

### Fix Node Version
Add to `package.json`:
```json
"engines": {
  "node": ">=18.0.0"
}
```

### Database Connection Error
```bash
# MongoDB Atlas settings:
1. Network Access → Add IP: 0.0.0.0/0
2. Database Access → Create user with password
3. Copy connection string correctly
```

---

## 🎉 Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Gmail App Password generated
- [ ] Paystack keys ready
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel/Render
- [ ] Environment variables configured
- [ ] CORS updated with actual URLs
- [ ] Test signup flow
- [ ] Test email verification
- [ ] Test payments

---

## 📞 Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Vercel Docs: https://vercel.com/docs

Your app will be live at:
- Backend: `https://loran-backend.onrender.com`
- Frontend: `https://loran-frontend.onrender.com` or Vercel URL
