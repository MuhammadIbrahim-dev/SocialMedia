import { Comment } from '../models/commentmodel/comment.js';
import { Post } from '../models/postmodel/Post.js';
import { changeScore } from '../utils/reputation.js';

/**
 * Create comment for a post
 */
export const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Missing content' });

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({
      postId: req.params.postId,
      content,
      userId: req.user._id
    });

    // optional: small reward for commenting (not in spec) — skipping for now
    const populatedComment = await comment.populate('userId', 'username avatar score');
    res.status(201).json(populatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCommentsForPost = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).populate('userId', 'username avatar score').sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (String(comment.userId) !== String(req.user._id)) return res.status(403).json({ message: 'Not authorized' });

    comment.content = content ?? comment.content;
    await comment.save();
    const populatedComment = await comment.populate('userId', 'username avatar score');
    res.json(populatedComment);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    if (String(comment.userId) !== String(req.user._id)) return res.status(403).json({ message: 'Not authorized' });

    await Comment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Vote on comment
 * value: +1 or -1
 * Rules:
 * +5 -> comment upvote (comment owner)
 * -2 -> comment downvote (owner)
 * For upvoter engagement bonus: we will NOT give +2 here (spec only mentioned posts), but we could add similarly.
 */
export const voteComment = async (req, res) => {
  try {
    const { value } = req.body;
    if (![1, -1].includes(value)) return res.status(400).json({ message: 'Invalid vote' });

    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const uid = String(req.user._id);
    const ownerId = String(comment.userId);
    const existingIndex = comment.votes.findIndex(v => String(v.userId) === uid);

    if (existingIndex > -1) {
      const existing = comment.votes[existingIndex];
      if (existing.value === value) {
        // toggle off
        comment.votes.splice(existingIndex, 1);
        await comment.save();
        if (value === 1) {
          // revert +5
          await changeScore(comment.userId, -5);
        } else {
          // revert -2
          await changeScore(comment.userId, +2);
        }
        const populated = await comment.populate('userId', 'username avatar score');
        return res.json(populated);
      } else {
        // switch vote: revert old then apply new
        if (existing.value === 1) await changeScore(comment.userId, -5);
        else await changeScore(comment.userId, +2);
        comment.votes[existingIndex].value = value;
      }
    } else {
      comment.votes.push({ userId: req.user._id, value });
    }

    if (value === 1) {
      await changeScore(comment.userId, 5);
    } else {
      await changeScore(comment.userId, -2);
    }

    await comment.save();
    const populated = await Comment.findById(comment._id).populate('userId', 'username avatar score');
    res.json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
