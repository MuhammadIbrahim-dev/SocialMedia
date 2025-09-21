import { User } from '../models/Authmodel/User.js';



/**
 * Reputation rules:
 * +10 -> post upvote
 * +5  -> comment upvote
 * +2  -> user upvotes someone else's post (encourages engagement)
 * -2  -> post/comment gets a downvote
 */

export async function changeScore(userId, delta) {
  if (!userId) return;
  await User.findByIdAndUpdate(userId, { $inc: { score: delta } });
}
