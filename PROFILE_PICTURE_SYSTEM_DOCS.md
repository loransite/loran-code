# Profile Picture Upload & Display System Documentation

## Overview
This system allows both clients and designers to upload their profile pictures during signup and update them from their dashboards. Profile pictures are displayed in the dashboard header along with user information.

## Features

### 1. **Signup Success Notification**
- After successful registration, users see an alert: "✅ Account created successfully! Welcome, [Name]!"
- User email and role are saved to localStorage for quick access
- Automatic redirect to appropriate dashboard (client/designer)

### 2. **Profile Picture Upload**
- **During Signup**: Users can upload a profile picture in the signup form
- **In Dashboard**: Users can update their picture by hovering over it and clicking the camera icon
- **Preview**: Immediate preview of uploaded picture before server upload
- **Supported Formats**: All image types (jpg, png, webp, etc.)

### 3. **Profile Header Component**
Location: `loranfrontend/components/Dashboard/ProfileHeader.tsx`

Displays:
- **Profile Picture**: Circular avatar with gradient background if no picture
- **User Info**: Full name, email
- **Designer-Specific**: 
  - Star rating with total reviews
  - Example: "⭐ 4.8 (12 reviews)"
- **Client-Specific**:
  - Height and BMI information
  - Example: "Height: 175 cm • BMI: 22.4"
- **Role Badge**: Colored badge showing "Client" or "Designer"

Features:
- Hover over picture → shows camera icon overlay
- Click camera → opens file picker
- Upload progress indicator (spinner)
- Automatic profile refresh after upload

## Backend API Endpoints

### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "user_id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "client",
  "profilePicture": "uploads/1234567890-profile.jpg",
  "height": 175,
  "bmi": 22.4,
  "rating": 4.8,
  "totalReviews": 12
}
```

### Update Profile Picture
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body: FormData with "profilePicture" field
```

**Response:**
```json
{
  "_id": "user_id",
  "fullName": "John Doe",
  "profilePicture": "uploads/1234567890-new-profile.jpg",
  ...
}
```

### Get Public Profile
```http
GET /api/users/:userId
```
Used to view designer profiles publicly (no authentication required).

## File Structure

### Frontend Files
```
loranfrontend/
├── components/
│   └── Dashboard/
│       └── ProfileHeader.tsx       # Reusable profile header component
├── app/
│   ├── signup/
│   │   └── page.tsx               # Signup with success notification
│   └── dashboard/
│       ├── client/
│       │   └── page.tsx           # Client dashboard with ProfileHeader
│       └── designer/
│           └── page.tsx           # Designer dashboard with ProfileHeader
```

### Backend Files
```
LoranBackend/
├── controller/
│   └── usercontroller.js          # Profile CRUD operations
├── routes/
│   └── userroutes.js              # /api/users routes
└── server.js                      # Registered user routes
```

## Usage Examples

### For Designers
1. **Sign up** → Upload profile picture (optional)
2. **Dashboard** → See profile header with:
   - Profile picture
   - Name, email
   - Star rating and review count
   - "Designer" badge
3. **Update Picture**:
   - Hover over current picture
   - Click camera icon
   - Select new image
   - Picture updates instantly

### For Clients
1. **Sign up** → Upload profile picture (optional)
2. **Dashboard** → See profile header with:
   - Profile picture
   - Name, email
   - Height and BMI (if provided)
   - "Client" badge
3. **Update Picture**: Same process as designers

## Image Handling

### Upload Process
1. User selects image file
2. Frontend creates preview using FileReader
3. FormData sent to `/api/users/profile` with multipart/form-data
4. Backend multer middleware saves to `uploads/` directory
5. File path stored in User model
6. Updated user data returned to frontend
7. localStorage updated with new user data

### Storage Location
- **Path**: `LoranBackend/uploads/`
- **Format**: `[timestamp]-[random]-[originalname]`
- **Example**: `1704123456789-profile.jpg`
- **Access**: `http://localhost:5000/uploads/[filename]`

### Display URL Construction
```javascript
const imageUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/${user.profilePicture}`;
// Example: http://localhost:5000/uploads/1704123456789-profile.jpg
```

## Security Features

1. **Authentication Required**: Profile updates require valid JWT token
2. **File Type Validation**: Only image files accepted (handled by multer)
3. **User Isolation**: Users can only update their own profile
4. **Password Excluded**: Profile endpoints never return password field
5. **Public vs Private**: Public endpoint shows limited fields for privacy

## Error Handling

### Upload Failures
```javascript
try {
  // upload code
} catch (error) {
  alert(error.response?.data?.message || "Failed to upload picture");
  // Revert preview to previous picture
}
```

### Missing Profile
```javascript
// Shows gradient background with user icon if no picture
{previewUrl ? (
  <img src={previewUrl} alt={user.fullName} />
) : (
  <User className="w-12 h-12 text-white" />
)}
```

## Testing Checklist

- [ ] Signup with profile picture works
- [ ] Signup without profile picture works
- [ ] Success message shows after signup
- [ ] Client dashboard displays ProfileHeader
- [ ] Designer dashboard displays ProfileHeader
- [ ] Picture upload from dashboard works
- [ ] Hover effect shows camera icon
- [ ] Upload shows spinner during progress
- [ ] Failed upload reverts preview
- [ ] Designer rating displays correctly
- [ ] Client height/BMI displays correctly
- [ ] Profile picture persists after logout/login
- [ ] Pictures load correctly from uploads/ directory

## Future Enhancements

1. **Image Optimization**: Compress images before upload
2. **Crop Tool**: Allow users to crop/adjust pictures
3. **Multiple Sizes**: Generate thumbnail, medium, large versions
4. **Cloud Storage**: Move from local storage to AWS S3 or Cloudinary
5. **Default Avatars**: Generate unique default avatars based on initials
6. **Profile Completion**: Show percentage of completed profile fields

## Integration with Existing Systems

### Review System
- Profile pictures displayed in ReviewList for clients who left reviews
- Designer profile picture shown on designer detail pages

### Order System
- Client/designer pictures could be shown in order details
- Helps personalize the ordering experience

### Messaging System (Future)
- Profile pictures will be used in chat interfaces
- Visual identification in message threads
