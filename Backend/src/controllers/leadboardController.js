import { User } from '../models/Authmodel/User.js';

export const getTopUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const top = await User.find().select('-passwordHash').sort({ score: -1 }).limit(limit);
    res.json(top);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
