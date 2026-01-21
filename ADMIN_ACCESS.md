# Admin Access Guide

## 🔐 Admin Account Creation

Admin accounts **CANNOT** be created through the signup page. Only clients and designers can signup normally.

### Method 1: Create Admin via Script (Recommended)

Run from `LoranBackend` folder:

```bash
node scripts/create-admin.mjs
```

Follow the prompts to enter:
- Full Name
- Email
- Password (minimum 6 characters)

The script will:
- ✅ Create a new admin user
- ✅ Hash the password securely
- ✅ Upgrade existing users to admin (if needed)
- ✅ Display login credentials

---

### Method 2: Create Admin via MongoDB Compass

1. Open MongoDB Compass
2. Connect to your database
3. Navigate to the `users` collection
4. Insert a new document:

```json
{
  "fullName": "Admin Name",
  "email": "admin@loran.com",
  "password": "$2a$12$[hashed_password]",
  "role": "admin",
  "createdAt": ISODate("2026-01-19T00:00:00.000Z")
}
```

**Note:** Password must be hashed using bcrypt. Use an online bcrypt generator or the script above.

---

## 🎯 Admin Login

1. Navigate to: `/login`
2. Enter admin email and password
3. You'll be redirected to: `/dashboard/admin`

---

## 🎨 Admin Dashboard Features

**Access URL:** `/dashboard/admin`

### Overview Tab
- Total orders, users, designers, revenue
- Recent orders preview
- Quick insights and stats

### Orders Tab
- View all orders with details
- Confirm or cancel orders
- Update order status

### Users Tab
- View all registered clients
- Contact information
- Registration dates

### Designers Tab
- View all designers
- Brand names and locations
- Experience levels

---

## 🛡️ Security Features

✅ Admin role cannot be selected during signup  
✅ Backend blocks admin signup attempts (403 Forbidden)  
✅ Admin-only routes protected with role middleware  
✅ Passwords hashed with bcrypt (12 rounds)  
✅ JWT tokens expire after 7 days  

---

## 📝 Default Admin Credentials

**Create your first admin using the script above.**

For testing, you can create:
- Email: `admin@loran.com`
- Password: `admin123` (change after first login)

```bash
node scripts/create-admin.mjs
```
