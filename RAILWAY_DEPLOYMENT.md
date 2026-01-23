# 🚂 Railway Deployment Guide

## Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub account with your code pushed
- MongoDB Atlas account (for database)
- Gmail account (for email service)
- Paystack account (for payments)

---

## Quick Start

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Deploy Backend (LoranBackend)

#### Step 1: Create New Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository
5. Choose **LoranBackend** folder as root

#### Step 2: Configure Environment Variables
In Railway dashboard, go to Variables tab and add:

```env
# MongoDB (Use MongoDB Atlas)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lorandb?retryWrites=true&w=majority

# JWT Secret (Generate random 32+ character string)
JWT_SECRET=your_generated_super_secret_jwt_key_here_min_32_chars

# Server Config
PORT=5000
NODE_ENV=production

# Frontend URL (will update after frontend deployment)
FRONTEND_URL=https://your-frontend-domain.railway.app

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@loran.com

# Paystack (LIVE keys for production)
PAYSTACK_SECRET_KEY=sk_live_your_paystack_secret_key

# Base URL (Railway will auto-assign)
BASE_URL=${{RAILWAY_PUBLIC_DOMAIN}}

# File Upload
MAX_FILE_SIZE=10485760

# Test Database (optional)
MONGO_TEST_URI=mongodb+srv://username:password@cluster.mongodb.net/loran-test
```

#### Step 3: Configure Build Settings
1. In Settings → Build, ensure:
   - **Root Directory**: `/LoranBackend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### Step 4: Deploy
- Railway will automatically deploy
- Get your backend URL: `https://your-backend.railway.app`

---

### 3. Deploy Frontend (loranfrontend)

#### Step 1: Create Another Service
1. In same Railway project, click "New Service"
2. Select "Deploy from GitHub repo"
3. Select same repository
4. Choose **loranfrontend** folder as root

#### Step 2: Configure Environment Variables
In Railway dashboard, add:

```env
# Backend API URL (from backend deployment)
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app

# Environment
NEXT_PUBLIC_ENV=production

# Site URL (Railway auto-assigned)
NEXT_PUBLIC_SITE_URL=${{RAILWAY_PUBLIC_DOMAIN}}

# Paystack Public Key (LIVE key)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_paystack_public_key

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_TRYON=true
NEXT_PUBLIC_ENABLE_REVIEWS=true
```

#### Step 3: Configure Build Settings
1. In Settings → Build:
   - **Root Directory**: `/loranfrontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

#### Step 4: Deploy
- Railway will build and deploy
- Get your frontend URL: `https://your-frontend.railway.app`

---

### 4. Update Backend CORS

After frontend deployment:
1. Go to Backend service variables
2. Update `FRONTEND_URL` to your actual frontend URL
3. Redeploy backend

---

## MongoDB Atlas Setup

### Create Production Database
1. Go to https://cloud.mongodb.com
2. Create new cluster (Free M0 tier available)
3. Create database user with strong password
4. Configure Network Access:
   - Add `0.0.0.0/0` (allow from anywhere - Railway uses dynamic IPs)
   - Or add Railway's IP addresses if provided
5. Get connection string and update `MONGO_URI` in Railway

---

## Gmail App Password Setup

### For Email Service
1. Enable 2FA on your Gmail account
2. Go to Google Account → Security → 2-Step Verification
3. Scroll to "App passwords"
4. Generate new app password for "Mail"
5. Use this password as `EMAIL_PASS` in Railway

---

## Paystack Setup

### Switch to Live Mode
1. Login to https://dashboard.paystack.com
2. Toggle to "Live Mode" (top right)
3. Go to Settings → API Keys & Webhooks
4. Copy your LIVE keys:
   - `PAYSTACK_SECRET_KEY` → Backend
   - Public Key → Frontend (`NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`)

---

## Post-Deployment Checklist

### Backend Health Check
- [ ] Visit `https://your-backend.railway.app/` - should see welcome message
- [ ] Check Railway logs for any errors
- [ ] Test signup endpoint
- [ ] Verify database connection

### Frontend Health Check
- [ ] Visit `https://your-frontend.railway.app`
- [ ] Test signup flow
- [ ] Check email verification
- [ ] Test login
- [ ] Test AI Try-On
- [ ] Test payment flow

### Security Verification
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] All `.env` files are in `.gitignore`
- [ ] Production URLs are HTTPS
- [ ] CORS is properly configured
- [ ] Rate limiting is working
- [ ] MongoDB credentials are secure

### Email Testing
- [ ] Signup welcome email sends
- [ ] Email verification link works
- [ ] Password reset email sends
- [ ] All email links point to production domain

---

## Custom Domain (Optional)

### Backend Custom Domain
1. In Railway backend service → Settings → Domains
2. Click "Add Custom Domain"
3. Add your domain (e.g., `api.yourdomain.com`)
4. Add CNAME record in your DNS:
   - Name: `api`
   - Value: Your Railway backend URL
5. Update `BASE_URL` and frontend's `NEXT_PUBLIC_BACKEND_URL`

### Frontend Custom Domain
1. In Railway frontend service → Settings → Domains
2. Click "Add Custom Domain"
3. Add your domain (e.g., `yourdomain.com`)
4. Add CNAME record in your DNS:
   - Name: `@` or `www`
   - Value: Your Railway frontend URL
5. Update backend's `FRONTEND_URL`

---

## Monitoring & Maintenance

### Railway Dashboard
- Monitor CPU/Memory usage
- Check deployment logs
- Set up log draining (optional)
- Configure health checks

### Database Monitoring
- MongoDB Atlas → Metrics
- Monitor storage usage
- Enable automated backups
- Set up alerts

### Cost Management
- Railway: $5/month per service (backend + frontend = $10/month)
- MongoDB Atlas: Free tier (M0) available, M10 starts at $9/month
- Monitor usage in Railway dashboard

---

## Troubleshooting

### Build Fails
```bash
# Check logs in Railway dashboard
# Common issues:
- Missing dependencies in package.json
- Node version mismatch (ensure Node 18+)
- Environment variables not set
```

### Database Connection Error
```bash
# Check:
- MONGO_URI is correct
- MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Database user has correct permissions
```

### CORS Errors
```bash
# Ensure:
- FRONTEND_URL in backend matches actual frontend URL
- NEXT_PUBLIC_BACKEND_URL in frontend matches actual backend URL
- Both use HTTPS in production
```

### Email Not Sending
```bash
# Verify:
- EMAIL_USER and EMAIL_PASS are correct
- Gmail App Password is valid (not regular password)
- 2FA is enabled on Gmail account
```

### 502 Bad Gateway
```bash
# Common causes:
- Backend service crashed (check logs)
- Incorrect start command
- PORT environment variable not set correctly
```

---

## Useful Railway Commands

### CLI Installation
```bash
npm install -g @railway/cli
railway login
```

### Deploy from CLI
```bash
# Backend
cd LoranBackend
railway up

# Frontend
cd loranfrontend
railway up
```

### View Logs
```bash
railway logs
```

### Open Service
```bash
railway open
```

---

## Cost Estimate

### Railway Costs
- Backend Service: $5/month
- Frontend Service: $5/month
- **Total**: ~$10/month

### Additional Services
- MongoDB Atlas: Free (M0) or $9/month (M10)
- Domain Name: $10-15/year
- **Total Estimated**: $10-20/month

---

## Support & Resources

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Next.js Deployment: https://nextjs.org/docs/deployment

---

## Quick Reference URLs

After deployment, save these:
- ✅ Backend API: `https://your-backend.railway.app`
- ✅ Frontend: `https://your-frontend.railway.app`
- ✅ MongoDB Dashboard: https://cloud.mongodb.com
- ✅ Railway Dashboard: https://railway.app/dashboard
- ✅ Paystack Dashboard: https://dashboard.paystack.com

---

## Environment Variables Quick Copy

### Backend (.env)
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/lorandb
JWT_SECRET=generate_32_plus_character_random_string_here
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.railway.app
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=noreply@loran.com
PAYSTACK_SECRET_KEY=sk_live_your_key
BASE_URL=${{RAILWAY_PUBLIC_DOMAIN}}
MAX_FILE_SIZE=10485760
```

### Frontend (.env)
```env
NEXT_PUBLIC_BACKEND_URL=https://your-backend.railway.app
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_SITE_URL=${{RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your_key
NEXT_PUBLIC_ENABLE_AI_TRYON=true
NEXT_PUBLIC_ENABLE_REVIEWS=true
```

---

**🎉 Your Loran app is now live on Railway!**

Need help? Check Railway logs first, then verify all environment variables are set correctly.
