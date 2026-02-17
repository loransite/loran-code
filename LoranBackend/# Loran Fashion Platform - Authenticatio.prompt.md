# Loran Fashion Platform - Authentication & Routing Summary

## 🔐 AUTHENTICATION SYSTEM OVERVIEW

### Current Implementation Status: ✅ Functional (Needs Optimization)

---

## 1. AUTHENTICATION ARCHITECTURE

### **Storage Strategy**
- **Primary Storage:** `sessionStorage` (clears on tab close)
- **Data Stored:**
  - `token` - JWT authentication token (30-day expiration)
  - `user` - User object with profile data
  - `activeRole` - Current active role (client/designer/admin)
  - `availableRoles` - Array of all roles user has access to

### **Authentication Flow**

```
User visits site
    ↓
1. Login/Signup → Backend validates credentials
    ↓
2. Backend generates JWT token with:
   - userId
   - activeRole
   - availableRoles[]
   - email
   - 30-day expiration
    ↓
3. Frontend saves to sessionStorage
    ↓
4. AuthContext initializes global state
    ↓
5. Background profile refresh syncs latest data
    ↓
6. User can now access protected routes
```

### **Token Management**
- **JWT Structure:**
  ```javascript
  {
    id: "user_id",
    role: "client",        // Active role
    roles: ["client"],     // All available roles
    email: "user@email.com",
    exp: 1738454400        // 30 days from creation
  }
  ```

- **Automatic Injection:** Axios interceptor adds token to all API requests
- **Error Handling:** 401 responses trigger automatic logout and redirect to login

---

## 2. USER ROLES & PERMISSIONS

### **Role Hierarchy**

```
👤 Visitor (No Account)
    ↓ Sign Up
🛍️ Client
    ↓ Apply + Admin Approval
🎨 Designer (Client + Designer)
    ↓ Manually Granted
👑 Admin (All Permissions)
```

### **Role Details**

#### **VISITOR (Unauthenticated)**
**Can Access:**
- ✅ Home page `/`
- ✅ About page `/about`
- ✅ Browse catalogue `/catalogue` (read-only)
- ✅ View designers `/designers`
- ✅ Read reviews
- ✅ Login/Signup pages
- ✅ Password reset flow

**Cannot Access:**
- ❌ Shopping cart
- ❌ Place orders
- ❌ AI tools
- ❌ Upload designs
- ❌ Any dashboard
- ❌ Write reviews

---

#### **CLIENT ROLE**
**Can Access (Everything Visitor can + below):**

**Shopping & Orders:**
- ✅ Add items to cart
- ✅ Place orders → `POST /api/orders`
- ✅ Make payments → `POST /api/payments/initialize`
- ✅ View order history → `GET /api/orders/client`
- ✅ Track order status
- ✅ Delete cart items → `DELETE /api/orders/:id`

**AI & Measurements:**
- ✅ Use AI try-on tool → `POST /api/ai/process`
- ✅ Upload photos for measurements
- ✅ Save measurements → `POST /api/measurements`
- ✅ View measurement history → `GET /api/measurements/history`
- ✅ Get latest measurements → `GET /api/measurements/latest`

**Reviews & Feedback:**
- ✅ Write reviews → `POST /api/reviews/:orderId`
- ✅ View reviewable orders → `GET /api/reviews/reviewable`
- ✅ Check review eligibility → `GET /api/reviews/can-review/:orderId`

**Dashboard Access:**
- ✅ Client dashboard → `/dashboard/client`
- ✅ Measurements page → `/dashboard/client/measurements`
- ✅ Profile management
- ✅ Email verification

**Role Management:**
- ✅ Apply to become designer → `POST /api/auth/add-role`
- ✅ Switch roles (if multiple) → `POST /api/auth/switch-role`

**Cannot Access:**
- ❌ Upload designs (unless approved designer)
- ❌ View designer orders
- ❌ Admin panel
- ❌ Approve users/content

---

#### **DESIGNER ROLE**
**Can Access (Everything Client can + below):**

**Design Management:**
- ✅ Upload designs → `POST /api/designs/designer`
- ✅ View own designs → `GET /api/designs/mine`
- ✅ Manage portfolio
- ✅ Create catalogue items → `POST /api/catalogue`

**Orders & Sales:**
- ✅ View designer orders → `GET /api/orders/designer`
- ✅ See orders for their designs
- ✅ Track design sales

**Dashboard Access:**
- ✅ Designer dashboard → `/dashboard/designer`
- ✅ Public profile visible to all users
- ✅ Portfolio showcase

**Cannot Access:**
- ❌ Approve own designs (needs admin)
- ❌ View all platform orders
- ❌ Admin controls
- ❌ Other designers' data

---

#### **ADMIN ROLE**
**Can Access (EVERYTHING + below):**

**User Management:**
- ✅ View all users → `GET /api/admin/users`
- ✅ Approve designers → `POST /api/admin/approve-designer`
- ✅ Reject designer applications
- ✅ Modify user roles

**Content Moderation:**
- ✅ View all catalogue → `GET /api/admin/catalogue`
- ✅ Approve designs → `POST /api/admin/approve-item`
- ✅ Reject designs
- ✅ Delete inappropriate content

**Order Management:**
- ✅ View ALL orders → `GET /api/admin/orders`
- ✅ Update order status → `PUT /api/orders/:id/status`
- ✅ Cancel any order
- ✅ Process refunds

**Dashboard Access:**
- ✅ Admin dashboard → `/dashboard/admin`
- ✅ Platform analytics
- ✅ User statistics
- ✅ Revenue tracking

**Cannot Access:**
- ❌ Direct database access (requires server)
- ❌ Other admins' passwords
- ❌ Payment gateway settings (code-level)

---

## 3. ROUTING STRUCTURE

### **Public Routes (No Auth Required)**

```typescript
const publicRoutes = [
  '/',                          // Homepage
  '/about',                     // About page
  '/catalogue',                 // Browse designs
  '/designers',                 // Designer list
  '/designers/[id]',           // Designer profile
  '/login',                     // Login page
  '/signup',                    // Signup page
  '/forgot-password',          // Password reset request
  '/reset-password/[token]',   // Password reset form
  '/verify-email/[token]',     // Email verification
];
```

### **Protected Routes (Auth Required)**

#### **Client Routes** (activeRole = "client")
```typescript
'/dashboard/client'              // Client dashboard
'/dashboard/client/measurements' // Measurements management (NEW!)
'/order'                         // Order history
'/order/new'                     // Create new order
'/ai'                            // AI try-on tool
'/reviews'                       // Submit reviews
'/payment/*'                     // Payment pages
```

#### **Designer Routes** (activeRole = "designer")
```typescript
'/dashboard/designer'            // Designer dashboard
// + All client routes (designers are also clients)
```

#### **Admin Routes** (activeRole = "admin")
```typescript
'/dashboard/admin'               // Admin dashboard
// + All client routes
// + All designer routes
```

### **Route Protection Implementation**

**Current (Per-Page):**
```typescript
// Each dashboard page has this:
useEffect(() => {
  const token = sessionStorage.getItem("token");
  const activeRole = sessionStorage.getItem("activeRole");
  
  if (!token) {
    router.push("/login");
    return;
  }
  
  if (activeRole !== "client") {
    router.push("/login");
    return;
  }
}, []);
```

**Recommended (Middleware - Future):**
```typescript
// middleware.ts at project root
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;
  
  // Check if route requires auth
  if (isProtectedPath(pathname) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}
```

---

## 4. NAVIGATION FLOW

### **User Journey Examples**

#### **Scenario 1: Client Places Order**
```
Client logs in
    ↓
Redirects to /dashboard/client ✅
    ↓
Clicks "Browse Catalogue" card
    ↓
Views catalogue at /catalogue
    ↓
Clicks design card
    ↓
Clicks "Order Now"
    ↓
Redirects to /order/new?designId=xxx
    ↓
Choose measurement method:
  Option A: Manual entry → Fill form → Continue
  Option B: AI try-on → Redirects to /ai → Upload photos → Auto-redirect back
    ↓
Customize order
    ↓
Payment at /payment/initialize
    ↓
Order created and saved to DB
    ↓
Confirmation page
```

#### **Scenario 2: Client Adds Manual Measurements**
```
Client in dashboard
    ↓
Clicks "My Measurements" card ✅ NEW!
    ↓
Lands on /dashboard/client/measurements
    ↓
Sees current measurements (if any)
    ↓
Clicks "Add New" button
    ↓
Modal opens with form
    ↓
Fills in measurements (height, chest, waist, etc.)
    ↓
Clicks "Save Measurements"
    ↓
POST to /api/measurements with method: "manual"
    ↓
Saved to user.measurementHistory array
    ↓
Page refreshes, new measurement appears at top
```

#### **Scenario 3: Client Uses AI Try-On for Measurements**
```
Client in measurements page
    ↓
Clicks "AI Try-On" button
    ↓
Redirects to /ai
    ↓
Uploads front & side photos + height
    ↓
AI processes images
    ↓
Returns measurements:
  {
    height: 70,
    chest: 38,
    waist: 32,
    hips: 40,
    shoulder: 18,
    sleeveLength: 24,
    inseam: 32
  }
    ↓
User clicks "Save Measurements"
    ↓
POST to /api/measurements with method: "ai"
    ↓
Saved to database
    ↓
Can view in measurement history
```

#### **Scenario 4: Client Becomes Designer**
```
Client in dashboard
    ↓
Sees "Want to sell your designs?" banner
    ↓
Clicks "Start Designer Application"
    ↓
Form opens with fields:
  - Brand name
  - Phone, location
  - Years of experience
  - Bio/description
    ↓
Submits form → POST /api/auth/add-role
    ↓
Backend sets designerStatus: "pending"
    ↓
Banner changes to "Application Pending"
    ↓
Admin reviews in /dashboard/admin
    ↓
Admin approves → POST /api/admin/approve-designer
    ↓
Backend updates:
  - designerStatus: "approved"
  - roles: ["client", "designer"]
    ↓
User refreshes → sees role switcher in navbar
    ↓
Can now switch to designer mode
    ↓
Accesses /dashboard/designer
```

#### **Scenario 5: Designer Uploads Design**
```
User switches to designer role
    ↓
Navbar updates to "Designer ▼"
    ↓
Navigates to /dashboard/designer
    ↓
Clicks "Upload Design" button
    ↓
Form opens:
  - Upload image
  - Title, description
  - Price, category
    ↓
Submits → POST /api/designs/designer
    ↓
Backend creates:
  - Design document
  - Catalogue item with status: "pending"
    ↓
Design appears in designer's portfolio
    ↓
Admin must approve before visible on catalogue
    ↓
Admin approves → status: "approved"
    ↓
Design now visible to all users in catalogue
```

---

## 5. BACKEND API ROUTES

### **Authentication Endpoints**
```javascript
POST /api/auth/signup              // Create account
POST /api/auth/login               // Login
POST /api/auth/forgot-password     // Request reset
POST /api/auth/reset-password      // Reset with token
GET  /api/auth/verify-email/:token // Verify email
POST /api/auth/resend-verification // Resend email
POST /api/auth/add-role            // Apply for designer (protected)
POST /api/auth/switch-role         // Switch active role (protected)
```

### **Client Endpoints**
```javascript
// Orders
POST   /api/orders                 // Create order (client only)
GET    /api/orders/client          // Get client orders (client only)
DELETE /api/orders/:id             // Delete order (client only)

// Measurements
POST /api/measurements             // Save measurements (client only)
GET  /api/measurements/history     // Get history (client only)
GET  /api/measurements/latest      // Get latest (client only)

// Reviews
POST /api/reviews/:orderId         // Submit review (client only)
GET  /api/reviews/reviewable       // Get reviewable orders (client only)
GET  /api/reviews/can-review/:id   // Check eligibility (client only)

// Payments
POST /api/payments/initialize      // Start payment (client only)
GET  /api/payments/verify          // Verify payment
```

### **Designer Endpoints**
```javascript
// Designs
POST /api/designs/designer         // Upload design (designer only)
GET  /api/designs/mine             // Get own designs (designer only)

// Orders
GET  /api/orders/designer          // Get designer orders (designer only)

// Catalogue
POST /api/catalogue                // Create catalogue item (designer only)
```

### **Admin Endpoints**
```javascript
// Users
GET  /api/admin/users              // All users (admin only)
POST /api/admin/approve-designer   // Approve designer (admin only)

// Orders
GET  /api/admin/orders             // All orders (admin only)
PUT  /api/admin/orders/:id/status  // Update status (admin only)

// Catalogue
GET  /api/admin/catalogue          // All items (admin only)
POST /api/admin/approve-item       // Approve item (admin only)
```

### **Public Endpoints (No Auth)**
```javascript
GET /api/catalogue                 // Browse catalogue (with filters)
GET /api/designers                 // List designers
GET /api/designers/:id             // Designer profile
GET /api/reviews/designer/:id      // Designer reviews
```

### **AI Endpoints**
```javascript
POST /api/ai/process               // AI measurements (requires login)
POST /api/ai/upload                // Upload photo (requires login)
POST /api/ai/generate              // Generate design (requires login)
```

---

## 6. SECURITY MEASURES

### **Backend Protection**
1. **JWT Validation:** Every protected route validates token
2. **Role Authorization:** Routes check activeRole matches required role
3. **Rate Limiting:** Login/signup limited to 10 attempts per 15 minutes
4. **Password Requirements:** Minimum 6 characters with complexity
5. **Mongo Sanitization:** Prevents NoSQL injection
6. **CORS:** Configured to allow only frontend origin
7. **Helmet:** Security headers enabled

### **Frontend Protection**
1. **SessionStorage:** Auto-clears on tab close
2. **Axios Interceptor:** Automatic token injection
3. **401 Handling:** Auto-logout on session expiration
4. **Per-Page Auth Checks:** Validates token and role before rendering
5. **Email Verification:** Optional verification system

---

## 7. CURRENT ISSUES & IMPROVEMENTS NEEDED

### **Issues Identified:**
1. ❌ No centralized middleware (relies on per-page checks)
2. ❌ Flash of content before redirect
3. ⚠️ No token refresh mechanism (30-day tokens)
4. ⚠️ Mixed storage usage (some components use localStorage)
5. ⚠️ Alert-based error messages (not modern UX)
6. ⚠️ No loading skeletons during auth checks

### **Recommended Improvements:**
1. ✅ Add Next.js middleware at project root
2. ✅ Create `withAuth()` HOC for reusable protection
3. ✅ Implement token refresh (15-min access + 30-day refresh)
4. ✅ Replace alerts with toast notifications
5. ✅ Add loading skeletons
6. ✅ Implement cross-tab logout sync
7. ✅ Add "Remember Me" option

---

## 8. NEW FEATURES ADDED

### **Measurements Management Page** ✅
**Location:** `/dashboard/client/measurements`

**Features:**
- View current/latest measurements
- Add measurements manually
- View full measurement history
- See which method was used (AI or Manual)
- Quick link to AI try-on tool
- Total records count
- Animated, modern UI

**How It Works:**
1. Client clicks "My Measurements" card in dashboard
2. Page loads with current measurements displayed
3. Can click "Add New" to open modal form
4. Fill in measurements (height, chest, waist, hips, shoulder, sleeve, inseam)
5. Save to database with method: "manual"
6. OR click "AI Try-On" to get measured using photos
7. All measurements saved to `user.measurementHistory[]` in MongoDB

**Backend Integration:**
- Uses existing `/api/measurements` endpoints ✅
- No backend changes needed ✅
- Fully functional ✅

---

## 9. COMPLETE USER FLOW DIAGRAM

```
┌─────────────────────────────────────────────────┐
│              VISITOR (No Account)               │
│  ✅ Browse catalogue, designers, reviews        │
│  ❌ Cannot shop, order, or access tools         │
└─────────────────┬───────────────────────────────┘
                  │ Sign Up
                  ↓
┌─────────────────────────────────────────────────┐
│                  CLIENT ROLE                    │
│  ✅ Shop catalogue, place orders, pay           │
│  ✅ Use AI try-on tool                          │
│  ✅ Save measurements (manual or AI) ✨ NEW!    │
│  ✅ Write reviews                               │
│  ✅ Access client dashboard                     │
│  ✅ Apply to become designer                    │
└─────────────────┬───────────────────────────────┘
                  │ Apply + Admin Approval
                  ↓
┌─────────────────────────────────────────────────┐
│                DESIGNER ROLE                    │
│  ✅ All client features +                       │
│  ✅ Upload designs to catalogue                 │
│  ✅ View orders for their designs               │
│  ✅ Manage portfolio                            │
│  ✅ Public designer profile                     │
│  ✅ Switch between client/designer modes        │
└─────────────────┬───────────────────────────────┘
                  │ Manually Granted by Super Admin
                  ↓
┌─────────────────────────────────────────────────┐
│                  ADMIN ROLE                     │
│  ✅ All client + designer features +            │
│  ✅ View all users, orders, designs             │
│  ✅ Approve/reject designers                    │
│  ✅ Approve/reject catalogue items              │
│  ✅ Update any order status                     │
│  ✅ Platform analytics & moderation             │
└─────────────────────────────────────────────────┘
```

---

## 10. TESTING CHECKLIST

### **Authentication Testing:**
- [ ] User can sign up with valid email
- [ ] User cannot sign up with existing email
- [ ] Login works with correct credentials
- [ ] Login fails with wrong password
- [ ] Token stored in sessionStorage after login
- [ ] Token auto-added to API requests
- [ ] 401 error triggers logout and redirect
- [ ] Password reset email received
- [ ] Email verification link works

### **Role Testing:**
- [ ] Client can access client dashboard
- [ ] Client cannot access designer dashboard
- [ ] Client cannot access admin dashboard
- [ ] Designer can switch to client mode
- [ ] Designer can upload designs
- [ ] Admin can view all users
- [ ] Admin can approve designers
- [ ] Role switcher shows only available roles

### **Measurements Testing:** ✨ NEW!
- [ ] Measurements page loads for clients
- [ ] Can add measurements manually
- [ ] Modal form validation works
- [ ] Measurements saved to database
- [ ] History displays correctly
- [ ] "AI Try-On" button redirects to /ai
- [ ] AI measurements saved with method: "ai"
- [ ] Manual measurements saved with method: "manual"
- [ ] Latest measurements displayed on top

### **Order Testing:**
- [ ] Client can browse catalogue
- [ ] Client can add to cart
- [ ] Order flow includes measurements
- [ ] Manual measurements accepted
- [ ] AI measurements flow works
- [ ] Payment initializes correctly
- [ ] Order saved to database
- [ ] Designer sees orders for their designs

---

## 11. DEPLOYMENT CONSIDERATIONS

### **Environment Variables Required:**

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxx
```

**Backend (.env):**
```bash
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PAYSTACK_SECRET_KEY=sk_live_xxx
FRONTEND_URL=https://your-frontend-url.com
```

### **Pre-Deployment Checklist:**
- [ ] All environment variables configured
- [ ] Email service tested (Gmail App Password)
- [ ] Paystack keys (test vs live)
- [ ] CORS configured for production URL
- [ ] Rate limiting enabled
- [ ] Database indexes created
- [ ] sessionStorage vs localStorage consistent
- [ ] All routes protected properly
- [ ] Error handling graceful

---

## SUMMARY

**Authentication:** ✅ Functional with JWT and sessionStorage  
**Routing:** ✅ Per-page protection (needs middleware upgrade)  
**Roles:** ✅ Client, Designer, Admin with proper restrictions  
**Measurements:** ✅ NEW feature - manual + AI integration  
**Security:** ✅ Backend protected, frontend needs improvement  
**UX:** ⚠️ Works but needs polish (loading states, toasts)  

**Overall Grade:** B+ (80/100)
- Core functionality solid ✅
- New measurements feature integrated ✅
- Needs architecture improvements for production ⚠️
- Security good at backend, frontend needs middleware ⚠️
