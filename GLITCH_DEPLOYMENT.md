# 🎮 Glitch Deployment Guide (No Credit Card)

## Deploy Backend on Glitch.com

### Step 1: Create Glitch Account
1. Go to https://glitch.com
2. Sign up with GitHub (no credit card)

### Step 2: Create New Project
1. Click **"New Project"** → **"Import from GitHub"**
2. Enter your repo URL: `https://github.com/loransite/loran-code`
3. Wait for import

### Step 3: Configure Project
1. In Glitch editor, click **".env"** file
2. Add environment variables:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lorandb
JWT_SECRET=your_super_secret_32_character_string
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@loran.com
PAYSTACK_SECRET_KEY=sk_live_your_key
BASE_URL=https://your-project.glitch.me
MAX_FILE_SIZE=10485760
```

### Step 4: Set Root Directory
Since Glitch imports the whole repo, you need to adjust:

1. Move contents of `LoranBackend` to root in Glitch
2. Or update `package.json` to point to LoranBackend

### Step 5: Deploy
- Glitch auto-deploys on changes
- Your API: `https://your-project.glitch.me`

---

## ⚙️ Glitch Limitations
- Projects sleep after 5 minutes of inactivity
- Wakes up instantly on first request
- 4000 hours/month (enough for 24/7 with some downtime)

---

## 🎯 Full Stack Setup

**Frontend**: Vercel (free, no card)
**Backend**: Glitch (free, no card)  
**Database**: MongoDB Atlas (free, no card)

**Total Cost**: $0/month 🎉
