import { User } from '../models/Authmodel/User.js';

/**
 * View profile by id (public)
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update own profile (bio / avatar)
 */
export const updateProfile = async (req, res) => {
  try {
    const { bio, avatar } = req.body;
    const updated = await User.findByIdAndUpdate(req.user._id, { bio: bio ?? req.user.bio, avatar: avatar ?? req.user.avatar }, { new: true }).select('-passwordHash');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
