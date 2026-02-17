# 🧪 Quick Test Guide

## Testing Email Verification (Without Email Setup)

### Step 1: Start Backend
```bash
cd LoranBackend
npm start
```

### Step 2: Start Frontend
```bash
cd loranfrontend
npm run dev
```

### Step 3: Sign Up New User
1. Go to http://localhost:3000/signup
2. Fill form with:
   - Email: test@example.com
   - Password: TestPass123!
   - Name: Test User
3. Click "Sign Up"

### Step 4: Get Verification Link
**Check backend console** for:
```
📧 [DEV MODE] Email verification would be sent to: test@example.com
🔗 Verification link: http://localhost:3000/verify-email/[long-token]
```

### Step 5: Verify Email
1. Copy the verification link from console
2. Paste in browser
3. Should see: ✅ "Email Verified! 🎉"
4. Auto-redirects to dashboard

### Step 6: Check Banner Gone
- Orange "Verify email" banner should disappear
- User is now verified

---

## Testing with Real Gmail

### Setup:
1. Go to https://myaccount.google.com/apppasswords
2. Generate app password
3. Update `.env`:
   ```bash
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=abcd-efgh-ijkl-mnop
   ```
4. Restart backend

### Test:
1. Sign up with real email address
2. Check inbox (may be in spam first time)
3. Click "Verify Email Address" button
4. Should redirect to verified page

---

## Running Automated Tests

```bash
cd LoranBackend
npm test
```

**Expected:**
- ✅ 27 tests pass
- ❌ 0 tests fail

---

## Test Scenarios

### ✅ Password Validation
- Try: `weak` → Should reject
- Try: `TestPass123!` → Should accept

### ✅ Email Validation  
- Try: `invalid-email` → Should reject
- Try: `test@example.com` → Should accept

### ✅ Duplicate Signup
- Sign up twice with same email → Should reject

### ✅ Resend Verification
1. Sign up
2. Click "Resend" in orange banner
3. New token generated (check console)

### ✅ Expired Token
- Old tokens (>24h) should be rejected
- User can request new one

---

## Common Issues

**Issue**: "Email service not configured"
**Solution**: This is normal! DEV MODE is active. Check console for verification link.

**Issue**: Tests fail with "Cannot connect to MongoDB"
**Solution**: Make sure MongoDB Atlas is accessible or update `MONGO_TEST_URI` in .env

**Issue**: Token not found in console
**Solution**: Look for lines starting with `📧 [DEV MODE]`

---

## Quick Checklist

Before deploying:
- [ ] Set EMAIL_USER and EMAIL_PASS in production .env
- [ ] Test email actually arrives
- [ ] Check spam folder first time
- [ ] Verify links work from email
- [ ] Run `npm test` - all pass
- [ ] Test resend functionality
- [ ] Test with expired token

---

**Ready to test!** 🚀
