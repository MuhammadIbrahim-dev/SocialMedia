import { User } from '../models/Authmodel/User.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload.js';

/**
 * View profile by id (public)
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update own profile (name, username, bio)
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, username, bio } = req.body;
    const userId = req.user._id;
    
    // Validation
    if (name && (name.trim().length < 2 || name.trim().length > 50)) {
      return res.status(400).json({ message: 'Name must be between 2 and 50 characters' });
    }
    
    if (username) {
      if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ message: 'Username must be between 3 and 30 characters' });
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores' });
      }
    }
    
    if (bio && bio.length > 500) {
      return res.status(400).json({ message: 'Bio must be less than 500 characters' });
    }
    
    // Check if username is already taken (if username is being updated)
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ 
        username: username.toLowerCase(),
        _id: { $ne: userId }
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }
    
    // Prepare update object
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (username) updateData.username = username.toLowerCase().trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: err.message });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Username is already taken' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update profile with avatar upload
 */
export const updateProfileWithAvatar = async (req, res) => {
  try {
    const { name, username, bio } = req.body;
    const userId = req.user._id;
    const file = req.file;
    
    // Validation
    if (name && (name.trim().length < 2 || name.trim().length > 50)) {
      return res.status(400).json({ message: 'Name must be between 2 and 50 characters' });
    }
    
    if (username) {
      if (username.length < 3 || username.length > 30) {
        return res.status(400).json({ message: 'Username must be between 3 and 30 characters' });
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores' });
      }
    }
    
    if (bio && bio.length > 500) {
      return res.status(400).json({ message: 'Bio must be less than 500 characters' });
    }
    
    // Check if username is already taken (if username is being updated)
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ 
        username: username.toLowerCase(),
        _id: { $ne: userId }
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
    }
    
    // Get current user to check for existing avatar
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    let avatarUrl = currentUser.avatar;
    let oldPublicId = null;
    
    // Handle avatar upload if file is provided
    if (file) {
      try {
        // Extract public_id from current avatar URL if it exists
        if (currentUser.avatar && currentUser.avatar.includes('cloudinary.com')) {
          const urlParts = currentUser.avatar.split('/');
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          oldPublicId = publicIdWithExtension.split('.')[0];
        }
        
        // Upload new avatar to Cloudinary
        const uploadResult = await uploadToCloudinary(file);
        avatarUrl = uploadResult.secure_url;
        
        // Delete old avatar from Cloudinary if it exists
        if (oldPublicId) {
          try {
            await deleteFromCloudinary(oldPublicId);
          } catch (deleteError) {
            console.error('Error deleting old avatar:', deleteError);
            // Don't fail the request if old avatar deletion fails
          }
        }
      } catch (uploadError) {
        console.error('Avatar upload error:', uploadError);
        return res.status(500).json({ message: 'Failed to upload avatar' });
      }
    }
    
    // Prepare update object
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (username) updateData.username = username.toLowerCase().trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    if (file) updateData.avatar = avatarUrl;
    
    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error('Error updating profile with avatar:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: err.message });
    }
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Username is already taken' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
