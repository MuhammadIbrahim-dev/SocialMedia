import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  value: { type: Number } // +1 or -1
}, { _id: false });

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  votes: [VoteSchema],
  createdAt: { type: Date, default: Date.now }
});

export const Post  = mongoose.model('Post', PostSchema);
