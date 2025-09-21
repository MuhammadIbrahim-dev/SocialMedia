# Profile Update & Avatar Upload System

## 🎯 Overview
A comprehensive profile update system with Cloudinary avatar upload functionality, built with React, Redux, Node.js, Express, and MongoDB.

## 🚀 Features

### ✅ Backend Features
- **Profile Update**: Update name, username, and bio
- **Avatar Upload**: Upload images to Cloudinary with automatic optimization
- **File Validation**: Image type and size validation (5MB limit)
- **Username Uniqueness**: Check for duplicate usernames
- **Data Sanitization**: Trim whitespace and validate inputs
- **Error Handling**: Comprehensive error handling and validation
- **Old Avatar Cleanup**: Automatically delete old avatars from Cloudinary

### ✅ Frontend Features
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Real-time Validation**: Client-side validation with error messages
- **Image Preview**: Live preview of selected avatar
- **Loading States**: Visual feedback during operations
- **File Upload**: Drag & drop or click to upload
- **Change Detection**: Only allow save when changes are made
- **Error Recovery**: Clear error messages and retry options

## 📁 File Structure

### Backend Files
```
Backend/src/
├── config/
│   └── cloudinary.js          # Cloudinary configuration
├── middleware/
│   └── upload.js              # Multer & Cloudinary upload middleware
├── controllers/
│   └── userCotroller.js       # Profile update controllers
├── Routes/
│   └── userRoute.js           # Profile routes
└── models/Authmodel/
    └── User.js                # Updated User model with username
```

### Frontend Files
```
Frontend/src/
├── pages/
│   ├── EditProfile.jsx        # Profile edit component
│   └── Profile.jsx            # Updated profile view
├── redux/
│   └── userSlice.jsx          # Profile update Redux actions
└── Components/
    └── Routings.jsx           # Updated with edit profile route
```

## 🔧 Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd Backend
npm install cloudinary
```

#### Environment Variables
Create a `.env` file in the Backend directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/hackathon

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Server
PORT=5000
NODE_ENV=development
```

#### Cloudinary Setup
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add them to your `.env` file

### 2. Frontend Setup
No additional dependencies required - all packages are already installed.

## 🛠️ API Endpoints

### Profile Routes
```javascript
// Get user profile (public)
GET /api/users/:id

// Update profile (without avatar)
PUT /api/users/me
Body: { name, username, bio }

// Update profile with avatar
PUT /api/users/me/avatar
Body: FormData with name, username, bio, avatar file
```

### Request Examples

#### Update Profile Without Avatar
```javascript
PUT /api/users/me
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "John Doe",
  "username": "johndoe",
  "bio": "Software developer passionate about web technologies"
}
```

#### Update Profile With Avatar
```javascript
PUT /api/users/me/avatar
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData:
- name: "John Doe"
- username: "johndoe"
- bio: "Software developer passionate about web technologies"
- avatar: <image file>
```

## 🎨 Frontend Usage

### Accessing Edit Profile
1. Navigate to your profile page: `/profile/:id`
2. Click the edit icon (pencil) next to your name
3. You'll be redirected to `/edit-profile`

### Editing Profile
1. **Avatar Upload**: Click on the avatar or "Upload Avatar" button
2. **Name**: Update your full name (2-50 characters)
3. **Username**: Update your username (3-30 characters, alphanumeric + underscore)
4. **Bio**: Update your bio (max 500 characters)
5. **Save**: Click "Save Changes" to update your profile

### Validation Rules
- **Name**: Required, 2-50 characters
- **Username**: Required, 3-30 characters, only letters, numbers, and underscores
- **Bio**: Optional, max 500 characters
- **Avatar**: Optional, image files only, max 5MB

## 🔒 Security Features

### Backend Security
- **Authentication**: JWT token required for updates
- **Authorization**: Users can only update their own profiles
- **Input Validation**: Server-side validation for all inputs
- **File Validation**: Image type and size validation
- **SQL Injection Protection**: Mongoose ODM protection
- **XSS Protection**: Input sanitization

### Frontend Security
- **Client-side Validation**: Real-time validation feedback
- **File Type Validation**: Only image files allowed
- **File Size Validation**: 5MB limit enforced
- **Error Handling**: Secure error message display

## 🎯 Key Features Explained

### Avatar Upload Process
1. **File Selection**: User selects an image file
2. **Client Validation**: Check file type and size
3. **Preview**: Show image preview before upload
4. **Upload**: Send to backend with FormData
5. **Cloudinary Processing**: Upload to Cloudinary with optimization
6. **Old Avatar Cleanup**: Delete previous avatar from Cloudinary
7. **Database Update**: Save new avatar URL to database
8. **UI Update**: Update profile display with new avatar

### Username Uniqueness
- **Real-time Check**: Backend checks for existing usernames
- **Case Insensitive**: Usernames are stored in lowercase
- **Validation**: Only alphanumeric characters and underscores allowed
- **Error Handling**: Clear error message if username is taken

### Change Detection
- **Smart Detection**: Only allow save when actual changes are made
- **Form State**: Track original values vs current values
- **File Changes**: Detect when new avatar is selected
- **User Feedback**: Disable save button when no changes detected

## 🐛 Error Handling

### Common Errors
1. **File Too Large**: "File size must be less than 5MB"
2. **Invalid File Type**: "Only image files are allowed"
3. **Username Taken**: "Username is already taken"
4. **Validation Errors**: Field-specific validation messages
5. **Network Errors**: "Failed to update profile"

### Error Recovery
- **Clear Messages**: Specific error messages for each issue
- **Retry Options**: Users can retry failed operations
- **Form Persistence**: Form data is preserved on errors
- **Graceful Degradation**: App continues to work even with errors

## 🚀 Performance Optimizations

### Backend Optimizations
- **Image Optimization**: Cloudinary automatically optimizes images
- **File Size Limits**: 5MB limit prevents large uploads
- **Efficient Queries**: Optimized database queries
- **Error Logging**: Comprehensive error logging for debugging

### Frontend Optimizations
- **Lazy Loading**: Components load only when needed
- **Image Preview**: Client-side preview without server round-trip
- **Debounced Validation**: Efficient validation without excessive API calls
- **Optimistic Updates**: Immediate UI feedback

## 📱 Responsive Design

### Mobile-First Approach
- **Touch-Friendly**: Large touch targets for mobile
- **Responsive Layout**: Adapts to all screen sizes
- **Mobile Upload**: Easy file selection on mobile devices
- **Optimized Forms**: Mobile-optimized form inputs

## 🔄 State Management

### Redux State Structure
```javascript
{
  users: {
    current: userObject,
    status: "idle" | "loading" | "succeeded" | "failed",
    error: null,
    updateStatus: "idle" | "loading" | "succeeded" | "failed",
    updateError: null
  }
}
```

### Actions Available
- `fetchUser(id)`: Fetch user profile
- `updateProfile(data)`: Update profile without avatar
- `updateProfileWithAvatar(formData)`: Update profile with avatar
- `clearUser()`: Clear current user
- `clearUpdateError()`: Clear update errors

## 🎉 Success!

Your profile update and avatar upload system is now fully functional! Users can:

✅ Update their profile information  
✅ Upload and change their avatar  
✅ See real-time validation feedback  
✅ Experience smooth, responsive UI  
✅ Have their data securely stored in Cloudinary  

The system is production-ready with comprehensive error handling, validation, and security features.
