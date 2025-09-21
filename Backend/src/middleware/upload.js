import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Validate Cloudinary configuration
const validateCloudinaryConfig = () => {
  const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing Cloudinary environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Configure Cloudinary
try {
  validateCloudinaryConfig();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary configured successfully');
} catch (error) {
  console.error('Cloudinary configuration failed:', error.message);
}

// Configure multer for memory storage (we'll upload to Cloudinary manually)
const storage = multer.memoryStorage();

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Function to upload file to Cloudinary
export const uploadToCloudinary = async (file, folder = 'hackathon/avatars') => {
  try {
    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      // Fallback: Return a reliable placeholder URL for development
      console.warn('Cloudinary not configured. Using fallback avatar URL.');
      return {
        secure_url: `https://ui-avatars.com/api/?name=${encodeURIComponent('Avatar')}&background=6366f1&color=ffffff&size=400`,
        public_id: `fallback_${Date.now()}`
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const publicId = `avatar_${timestamp}_${randomString}`;

    console.log('Uploading to Cloudinary with config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'missing',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'missing'
    });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      {
        folder: folder,
        public_id: publicId,
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto' }
        ]
      }
    );

    console.log('Upload successful:', result.secure_url);
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    // Fallback: Return a reliable placeholder URL for development
    console.warn('Cloudinary upload failed. Using fallback avatar URL.');
    return {
      secure_url: `https://ui-avatars.com/api/?name=${encodeURIComponent('Avatar')}&background=6366f1&color=ffffff&size=400`,
      public_id: `fallback_${Date.now()}`
    };
  }
};

// Function to delete file from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  try {
    // Skip deletion for fallback avatars
    if (publicId && publicId.startsWith('fallback_')) {
      console.log('Skipping deletion of fallback avatar:', publicId);
      return { result: 'ok' };
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary not configured. Skipping avatar deletion.');
      return { result: 'ok' };
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    // Don't throw error for deletion failures
    return { result: 'error', error: error.message };
  }
};

// Error handling middleware
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File too large. Maximum size is 5MB.' 
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ 
        message: 'Unexpected field name for file upload.' 
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({ 
      message: 'Only image files are allowed!' 
    });
  }
  
  next(error);
};

export default upload;
