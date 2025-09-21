# Cloudinary Setup Guide

## 🚨 Current Issue
The avatar upload is failing because Cloudinary is not configured. The error "Must supply api_secret" indicates missing environment variables.

## 🔧 Quick Fix (Development Mode)
I've added a fallback system that will work without Cloudinary for now. The system will use placeholder images when Cloudinary is not configured.

## 🚀 Proper Setup (Production Ready)

### Step 1: Create Cloudinary Account
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to your [Dashboard](https://cloudinary.com/console)

### Step 2: Get Your Credentials
From your Cloudinary dashboard, copy:
- **Cloud Name**
- **API Key** 
- **API Secret**

### Step 3: Create .env File
Create a `.env` file in your `Backend` directory with:

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
PORT=8000
NODE_ENV=development
```

### Step 4: Replace Placeholder Values
Replace the placeholder values with your actual Cloudinary credentials:

```env
CLOUDINARY_CLOUD_NAME=myapp123
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456789
```

### Step 5: Restart Server
```bash
cd Backend
npm run dev
```

## 🎯 What Happens Now

### Without Cloudinary (Current State)
- ✅ Avatar upload will work with placeholder images
- ✅ Profile updates will work normally
- ✅ No errors will occur
- ⚠️ Avatars will be placeholder images

### With Cloudinary (After Setup)
- ✅ Real avatar uploads to Cloudinary
- ✅ Automatic image optimization (400x400, face detection)
- ✅ Old avatar cleanup
- ✅ Professional image hosting

## 🔍 Testing the Fix

1. **Try uploading an avatar now** - it should work with a placeholder
2. **Check the server logs** - you should see "Cloudinary not configured. Using fallback avatar URL."
3. **After setting up Cloudinary** - you should see "Cloudinary configured successfully"

## 📱 Example Cloudinary Credentials Format

```env
CLOUDINARY_CLOUD_NAME=myapp123
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456789
```

## 🚨 Important Notes

- **Never commit your .env file** to version control
- **Keep your API Secret secure** - don't share it publicly
- **Free Cloudinary accounts** have generous limits for development
- **The fallback system** ensures your app works even without Cloudinary

## ✅ Verification

After setup, you should see in your server logs:
```
Cloudinary configured successfully
Uploading to Cloudinary with config: { cloud_name: 'myapp123', api_key: '***', api_secret: '***' }
Upload successful: https://res.cloudinary.com/myapp123/image/upload/v1234567890/avatar_1234567890_abc123.jpg
```

The avatar upload should now work perfectly! 🎉
