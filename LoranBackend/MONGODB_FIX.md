# MongoDB Connection Error Fix

## Current Issue
Your backend is failing to start with:
```
Socket 'secureConnect' timed out after 30550ms (connectTimeoutMS: 30000)
```

## Your Current IP
**102.89.41.46**

## Solution: Add IP to MongoDB Atlas Network Access

### Step 1: Go to MongoDB Atlas
1. Open https://cloud.mongodb.com/
2. Log in with your MongoDB Atlas account
3. Select your `Cluster0` project

### Step 2: Add IP to Network Access
1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"** button
3. Choose one of these options:
   
   **Option A: Add Current IP (Recommended for Development)**
   - Click "Add Current IP Address"
   - It will auto-detect: `102.89.41.46`
   - Add a comment: `Local Dev Machine`
   - Click "Confirm"
   
   **Option B: Allow Access from Anywhere (Testing Only)**
   - Enter IP: `0.0.0.0/0`
   - Add comment: `Allow all (temporary)`
   - Click "Confirm"
   - ⚠️ **Remove this after testing for security**

### Step 3: Wait for Changes to Propagate
- Atlas takes 1-2 minutes to activate the new IP
- Wait for the status to change from "Pending" to "Active"

### Step 4: Restart Backend
```powershell
cd LoranBackend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
✅ Server listening on port 5000
```

---

## Alternative: Use Local MongoDB (Quick Test)

If you don't have Atlas access right now, install MongoDB locally:

```powershell
# Install MongoDB via Chocolatey (if you have it)
choco install mongodb

# Or download from: https://www.mongodb.com/try/download/community
```

Then change `.env`:
```env
MONGO_URI=mongodb://localhost:27017/loran
```

Restart backend:
```powershell
npm run dev
```

---

## Verify Connection
Once backend starts successfully, test the AI endpoint:

```powershell
# Test with a sample image
curl -X POST http://localhost:5000/api/ai/process `
  -H "Authorization: Bearer YOUR_TOKEN_HERE" `
  -F "file=@C:\path\to\image.jpg" `
  -F "height=170"
```

Replace `YOUR_TOKEN_HERE` with a valid JWT from login.

---

## Current Environment
- **IP**: 102.89.41.46
- **MongoDB Cluster**: ac-tzwimtf-shard-00-00.1eyabey.mongodb.net
- **Connection String**: mongodb+srv://loranadmin:***@cluster0.1eyabey.mongodb.net/
- **Port**: 5000 (now free)

## Quick Actions
1. ✅ Killed process blocking port 5000 (PID 16616)
2. ✅ Updated `.env` with side/height field configs
3. ✅ Patched `aiService.js` to use configurable field names
4. ⏳ **Waiting for you to add IP to MongoDB Atlas Network Access**
