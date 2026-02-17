# ⭐ Review & Rating System

## Overview
Clients can now review designers after completing orders. Reviews appear on designer profile pages and help build trust in the platform.

---

## 🎯 Features

### For Clients:
✅ Review completed orders with 1-5 star rating
✅ Write detailed feedback comments
✅ View list of reviewable orders
✅ Quick access from client dashboard
✅ One review per order (cannot edit once submitted)

### For Designers:
✅ Reviews displayed on public profile page
✅ Average rating automatically calculated
✅ Total review count shown
✅ Reviews sorted by most recent
✅ Star rating breakdown (5-star, 4-star, etc.)

### For Everyone:
✅ Beautiful UI with star ratings
✅ Profile pictures in reviews
✅ Timestamps on all reviews
✅ Responsive design

---

## 📊 Database Schema

### Order Model (Updated)
```javascript
review: {
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  reviewedAt: { type: Date },
  isReviewed: { type: Boolean, default: false }
}
```

### User Model (Designer fields updated)
```javascript
rating: { type: Number, default: 0 },
totalReviews: { type: Number, default: 0 },
reviews: [{
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  reviewedAt: { type: Date, default: Date.now }
}]
```

---

## 🔌 API Endpoints

### 1. Submit Review
**POST** `/api/reviews/:orderId`

**Auth:** Client only

**Body:**
```json
{
  "rating": 5,
  "comment": "Excellent work! Very professional and delivered on time."
}
```

**Response:**
```json
{
  "message": "Review submitted successfully",
  "review": {
    "rating": 5,
    "comment": "...",
    "reviewedAt": "2026-01-19T...",
    "isReviewed": true
  },
  "designerRating": 4.8
}
```

**Validations:**
- ✅ Order must belong to the client
- ✅ Order must be completed
- ✅ Order not already reviewed
- ✅ Designer must be assigned
- ✅ Rating must be 1-5

---

### 2. Get Designer Reviews
**GET** `/api/reviews/designer/:designerId`

**Auth:** Public (no auth required)

**Response:**
```json
{
  "designerName": "Fashion House Ltd",
  "rating": 4.7,
  "totalReviews": 12,
  "reviews": [
    {
      "_id": "...",
      "clientId": {
        "fullName": "John Doe",
        "profilePicture": "..."
      },
      "rating": 5,
      "comment": "Amazing work!",
      "reviewedAt": "2026-01-19T..."
    }
  ]
}
```

---

### 3. Get Reviewable Orders
**GET** `/api/reviews/reviewable`

**Auth:** Client only

**Response:**
```json
{
  "orders": [
    {
      "_id": "...",
      "catalogueId": {
        "title": "Senator Suit",
        "imageUrl": "/uploads/..."
      },
      "designerId": {
        "_id": "...",
        "fullName": "Designer Name",
        "brandName": "Fashion House"
      },
      "total": 120000,
      "updatedAt": "2026-01-15T..."
    }
  ]
}
```

---

### 4. Check If Order Can Be Reviewed
**GET** `/api/reviews/can-review/:orderId`

**Auth:** Client only

**Response:**
```json
{
  "canReview": true,
  "reason": null
}
```

Or if blocked:
```json
{
  "canReview": false,
  "reason": "Order not completed yet"
}
```

---

## 🎨 Frontend Components

### 1. ReviewForm Component
**Location:** `components/Review/ReviewForm.tsx`

**Features:**
- Modal dialog with backdrop
- 5-star interactive rating selector
- Optional comment textarea
- Loading states during submission
- Error handling
- Success callback

**Usage:**
```tsx
import ReviewForm from '@/components/Review/ReviewForm';

<ReviewForm
  orderId="order_id_here"
  designerName="Fashion House"
  onSuccess={() => {
    // Refresh data, show success message, etc.
  }}
  onClose={() => {
    // Close modal
  }}
/>
```

---

### 2. ReviewList Component
**Location:** `components/Review/ReviewList.tsx`

**Features:**
- Rating summary with average score
- Star rating breakdown bars
- Individual review cards
- Client profile pictures
- Timestamps
- Empty state when no reviews

**Usage:**
```tsx
import ReviewList from '@/components/Review/ReviewList';

<ReviewList designerId="designer_id_here" />
```

---

## 📱 Pages

### 1. Reviews Page (`/reviews`)
**Access:** Clients only

Shows all completed orders that can be reviewed. Features:
- Grid of reviewable orders
- Order details (design name, designer, price, date)
- "Write Review" button for each order
- Empty state when all orders reviewed
- Opens ReviewForm modal when clicked

---

### 2. Designer Profile Page (`/designers/[id]`)
**Access:** Public

Enhanced with review section showing:
- Average rating with stars
- Total review count
- Full ReviewList component
- Beautiful gradient design

---

## 🚀 User Flow

### Client Review Flow:
1. Client completes an order (status = "completed")
2. Client sees "Write Review" prompt in dashboard
3. Client navigates to `/reviews` page
4. Client sees list of reviewable orders
5. Client clicks "Write Review" on an order
6. Modal opens with ReviewForm
7. Client selects 1-5 stars
8. Client optionally writes comment
9. Client submits review
10. Review saved to order AND designer profile
11. Designer's average rating automatically recalculated

### Public Viewing Flow:
1. Anyone visits `/designers/:id`
2. Scrolls to "Client Reviews" section
3. Sees average rating and total count
4. Sees star breakdown (how many 5-star, 4-star, etc.)
5. Scrolls through individual reviews
6. Sees client names, ratings, comments, and dates

---

## 🎯 Rating Calculation

Average rating is automatically calculated when a review is submitted:

```javascript
const totalRating = designer.reviews.reduce((sum, review) => sum + review.rating, 0);
designer.rating = totalRating / designer.reviews.length;
designer.totalReviews = designer.reviews.length;
```

Example:
- 3 reviews: [5, 4, 5]
- Total: 14
- Average: 14 / 3 = 4.67
- Displayed as: 4.7 ⭐

---

## 🔒 Security & Validation

### Backend Checks:
✅ JWT authentication required for submitting reviews
✅ Client can only review their own orders
✅ Order must be completed
✅ Cannot review twice
✅ Designer must be assigned to order
✅ Rating must be 1-5 (validated in schema)

### Frontend Validation:
✅ Rating required before submission
✅ Comment optional (no minimum length)
✅ Loading states prevent double submission
✅ Error messages displayed clearly

---

## 🎨 UI/UX Highlights

### Star Rating:
- Interactive hover effect (shows tentative rating)
- Click to set rating
- Color: Yellow (#FACC15) for filled stars
- Color: Gray (#D1D5DB) for empty stars
- Animated scale on hover

### Rating Labels:
- 1 star = "Poor"
- 2 stars = "Fair"
- 3 stars = "Good"
- 4 stars = "Very Good"
- 5 stars = "Excellent"

### Review Cards:
- White background with subtle border
- Profile picture or gradient placeholder
- Client name and date
- Star rating display
- Comment text (if provided)
- Responsive design

---

## 📊 Example Scenarios

### Scenario 1: Happy Client
```
Client: Sarah
Designer: Fashion House Ltd
Order: Senator Suit (₦120,000)
Status: Completed

1. Sarah visits /reviews
2. Sees "Senator Suit" order
3. Clicks "Write Review"
4. Gives 5 stars ⭐⭐⭐⭐⭐
5. Comments: "Absolutely stunning! Perfect fit and delivered ahead of schedule."
6. Submits
7. Fashion House's rating updates from 4.5 → 4.6
```

### Scenario 2: Designer Profile Visitor
```
Visitor: John (browsing designers)
Page: /designers/fashion-house-id

1. John sees:
   - Average Rating: 4.6 ⭐
   - Total Reviews: 15
   - Star breakdown:
     * 5 stars: 10 reviews
     * 4 stars: 4 reviews
     * 3 stars: 1 review
2. Scrolls through reviews
3. Reads Sarah's glowing review
4. Decides to order from Fashion House
```

---

## 🔧 Configuration

### Environment Variables
No additional env variables needed. Uses existing:
- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL
- JWT tokens from localStorage

### Routes Added:
- Backend: `/api/reviews/*`
- Frontend: `/reviews`

---

## 🎉 Benefits

### For Clients:
✨ Share experiences and help others
✨ Recognize great designers
✨ Simple, beautiful interface
✨ Quick access from dashboard

### For Designers:
✨ Build reputation and trust
✨ Showcase positive feedback
✨ Attract new clients
✨ Automatic rating calculation

### For Platform:
✨ Increased engagement
✨ Quality control mechanism
✨ Social proof for conversions
✨ Community building

---

## 🚀 Launch Checklist

✅ Backend models updated (Order, User)
✅ Review controller created
✅ Review routes registered
✅ Frontend components built (ReviewForm, ReviewList)
✅ Reviews page created (`/reviews`)
✅ Designer profile page updated
✅ Client dashboard updated with review prompt
✅ Navbar updated with Reviews link (clients only)
✅ TypeScript types updated
✅ Authentication/authorization working
✅ Error handling implemented
✅ Loading states added
✅ Responsive design complete

**Status: Production Ready! 🎊**

---

## 📝 Future Enhancements (Optional)

- [ ] Edit reviews (within 24 hours)
- [ ] Reply to reviews (designers)
- [ ] Report inappropriate reviews
- [ ] Filter reviews by rating
- [ ] Review verification badges
- [ ] Email notification when reviewed
- [ ] Review reminders (automated)

---

**Review system complete and ready to use!** ⭐
