# 🚀 Production Deployment Checklist

## Pre-Deployment

### Backend Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Set `NODE_ENV=production`
- [ ] Generate strong `JWT_SECRET` (32+ characters)
- [ ] Configure `MONGO_URI` (production MongoDB Atlas)
- [ ] Set up `EMAIL_USER` and `EMAIL_PASS` (Gmail App Password)
- [ ] Configure `PAYSTACK_SECRET_KEY` (live, not test)
- [ ] Set `FRONTEND_URL` to production domain
- [ ] Update `BASE_URL` to production API domain
- [ ] Add `MONGO_TEST_URI` for test database

### Frontend Configuration
- [ ] Copy `.env.example` to `.env.local`
- [ ] Set `NEXT_PUBLIC_BACKEND_URL` to production API
- [ ] Set `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Configure `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` (live key)
- [ ] Set `NEXT_PUBLIC_ENV=production`

### Security Checks
- [ ] JWT_SECRET is 32+ random characters
- [ ] All secrets are in `.env` (not hardcoded)
- [ ] `.env` is in `.gitignore`
- [ ] CORS origins updated to production domain
- [ ] Rate limiting configured appropriately
- [ ] File upload limits set (10MB)

### Database
- [ ] MongoDB Atlas production cluster created
- [ ] Database authentication enabled
- [ ] IP whitelist configured (server IP only)
- [ ] Automatic backups enabled
- [ ] Monitoring alerts set up
- [ ] Test connection from server

### Email Service
- [ ] Gmail App Password generated
- [ ] Test email sends successfully
- [ ] Check spam folder
- [ ] Verify links work from email
- [ ] Welcome email template tested
- [ ] Resend functionality tested

### Testing
- [ ] Run `npm test` - all 27 tests pass
- [ ] Manual signup test
- [ ] Email verification test
- [ ] Login/logout test
- [ ] Password reset test
- [ ] AI Try-On test
- [ ] Payment flow test
- [ ] Designer application test

---

## Deployment Steps

### 1. Backend Deployment (Node.js Server)

#### Option A: VPS/Cloud Server (DigitalOcean, AWS EC2, etc.)

```bash
# 1. SSH into server
ssh user@your-server-ip

# 2. Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2 (process manager)
sudo npm install -g pm2

# 4. Clone repository
git clone <your-repo-url>
cd loran/LoranBackend

# 5. Install dependencies
npm install --production

# 6. Create .env file
nano .env
# Paste production environment variables

# 7. Start with PM2
pm2 start server.js --name loran-backend
pm2 save
pm2 startup

# 8. Set up Nginx reverse proxy
sudo apt install nginx
sudo nano /etc/nginx/sites-available/loran-api

# Add:
server {
    listen 80;
    server_name api.your-domain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/loran-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 9. Install SSL certificate (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.your-domain.com
```

#### Option B: Heroku

```bash
# 1. Install Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Create app
heroku create loran-backend

# 4. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGO_URI=your-mongo-uri
# ... set all other env vars

# 5. Deploy
git push heroku main

# 6. Open logs
heroku logs --tail
```

#### Option C: Railway/Render (Easiest)

```bash
# 1. Connect GitHub repository
# 2. Add environment variables in dashboard
# 3. Deploy automatically on push
```

### 2. Frontend Deployment (Next.js)

#### Option A: Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
cd loranfrontend
vercel

# 4. Set environment variables in Vercel dashboard
# NEXT_PUBLIC_BACKEND_URL=https://api.your-domain.com
# NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...

# 5. Deploy production
vercel --prod
```

#### Option B: Netlify

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Build
cd loranfrontend
npm run build

# 4. Deploy
netlify deploy --prod
```

#### Option C: Self-Hosted

```bash
# 1. Build
cd loranfrontend
npm run build

# 2. Start production server
npm start

# 3. Use PM2 for production
pm2 start npm --name loran-frontend -- start
pm2 save
```

---

## Post-Deployment

### Verification
- [ ] Backend health check: `GET https://api.your-domain.com/health`
- [ ] Frontend loads: `https://your-domain.com`
- [ ] Signup works with email verification
- [ ] Login works
- [ ] Email arrives in inbox (not spam)
- [ ] Verification link works
- [ ] Dashboard accessible
- [ ] AI Try-On works
- [ ] Payment flow works
- [ ] Designer application works

### Monitoring Setup
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure error tracking (Sentry)
- [ ] Set up log aggregation (Logtail, Papertrail)
- [ ] Create alerts for:
  - Server down
  - High error rate
  - Failed email sends
  - Database connection issues
  - Rate limit hits

### Performance
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Test load times (<3s)
- [ ] Run Lighthouse audit (score 90+)

### Security
- [ ] Force HTTPS redirect
- [ ] Add security headers
- [ ] Configure firewall rules
- [ ] Enable DDoS protection (Cloudflare)
- [ ] Set up automated security scans
- [ ] Review rate limiting logs

### Backup Strategy
- [ ] Database: Automatic daily backups
- [ ] Files: Regular S3/cloud backups
- [ ] Code: Git repository synced
- [ ] Env variables: Secure backup
- [ ] Test restore procedure

---

## Domain Configuration

### DNS Records

```
Type    Name            Value                       TTL
A       @               your-frontend-ip            3600
A       api             your-backend-ip             3600
CNAME   www             your-domain.com             3600
TXT     @               v=spf1 include:_spf...      3600
```

### SSL Certificates

**Let's Encrypt (Free):**
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com
```

**Auto-renewal:**
```bash
sudo certbot renew --dry-run
```

---

## Environment Variables Reference

### Backend (.env)
```bash
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/loran
MONGO_TEST_URI=mongodb+srv://user:pass@cluster.mongodb.net/loran-test
JWT_SECRET=your-32-character-random-secret-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
PAYSTACK_SECRET_KEY=sk_live_your-live-secret-key
FRONTEND_URL=https://your-domain.com
BASE_URL=https://api.your-domain.com
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_BACKEND_URL=https://api.your-domain.com
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_your-live-public-key
```

---

## Troubleshooting

### Issue: Emails not sending
**Check:**
- EMAIL_USER and EMAIL_PASS set correctly
- Gmail App Password (not regular password)
- 2FA enabled on Gmail
- Check backend logs for errors

### Issue: CORS errors
**Check:**
- FRONTEND_URL in backend .env matches frontend domain
- No trailing slash in URLs
- HTTPS used in production

### Issue: Database connection fails
**Check:**
- MongoDB Atlas IP whitelist
- Connection string correct
- Network connectivity
- Database authentication

### Issue: Rate limiting too aggressive
**Solution:**
- Adjust limits in `server.js`
- Monitor logs for legitimate users hitting limits
- Consider different limits for authenticated users

---

## Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor uptime (should be 99.9%+)
- [ ] Review failed email sends

### Weekly
- [ ] Review rate limiting logs
- [ ] Check database performance
- [ ] Monitor server resources (CPU, RAM, disk)
- [ ] Review failed login attempts

### Monthly
- [ ] Update dependencies (`npm audit fix`)
- [ ] Review and rotate API keys
- [ ] Check SSL certificate expiry
- [ ] Performance audit
- [ ] Security scan
- [ ] Backup verification

### Quarterly
- [ ] Full security audit
- [ ] Load testing
- [ ] Review and update documentation
- [ ] Database optimization
- [ ] Cost review

---

## Rollback Plan

If deployment fails:

1. **Frontend**: Revert to previous Vercel deployment
2. **Backend**: PM2 rollback or redeploy previous commit
3. **Database**: Restore from backup
4. **DNS**: Revert to previous records (if changed)

---

## Support Contacts

Keep these handy:
- **MongoDB Atlas**: support@mongodb.com
- **Vercel**: support@vercel.com
- **Gmail**: https://support.google.com
- **Paystack**: support@paystack.com
- **Server Host**: [your hosting provider support]

---

## 🎉 Launch Checklist

Final checks before going live:

- [ ] All tests passing
- [ ] SSL certificates installed
- [ ] Domain pointing correctly
- [ ] Emails working
- [ ] Payments processing
- [ ] Error monitoring active
- [ ] Backups configured
- [ ] Team trained
- [ ] Documentation updated
- [ ] Marketing materials ready

---

**Ready to launch!** 🚀

---

*Checklist version: 1.0*
*Last updated: January 21, 2026*
