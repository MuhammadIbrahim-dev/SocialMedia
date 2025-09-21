import { Post } from '../models/postmodel/Post.js';
import { Comment } from '../models/commentmodel/comment.js';
import { changeScore } from '../utils/reputation.js';

/**
 * Create a post
 */
export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Missing title or content' });
    }

    const post = await Post.create({
      title,
      content,
      tags: Array.isArray(tags)
        ? tags
        : tags
        ? tags.split(',').map((t) => t.trim())
        : [],
      userId: req.user._id,
    });

    const populatedPost = await post.populate(
      'userId',
      'username avatar score'
    );
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all posts (latest first, populated with user)
 */
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('userId', 'username avatar score')
      .sort({ createdAt: -1 });
    res.status(200).json(posts)
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get single post
 */
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'userId',
      'username avatar score'
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (err) {
    console.error('Error fetching single post:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a post
 */
export const updatePost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (String(post.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized to update this post' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.tags = Array.isArray(tags)
      ? tags
      : tags
      ? tags.split(',').map((t) => t.trim())
      : post.tags;

    await post.save();
    const populatedPost = await Post.findById(post._id).populate(
      'userId',
      'username avatar score'
    );
    res.json(populatedPost);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a post
 */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (String(post.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Vote on a post
 * Body: { value: 1 } or { value: -1 }
 *
 * Reputation rules:
 * - Upvote: +10 to post owner, +2 to voter (if not self-vote)
 * - Downvote: -2 to post owner
 * - Toggling removes reputation changes
 */
export const vote = async (req, res) => {
  try {
    const { value } = req.body;
    if (![1, -1].includes(value)) {
      return res.status(400).json({ message: 'Invalid vote value' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const uid = String(req.user._id);
    const ownerId = String(post.userId);

    const existingIndex = post.votes.findIndex((v) => String(v.userId) === uid);

    // helper to adjust reputation
    const applyReputation = async (ownerDelta, voterDelta = 0) => {
      try {
        if (ownerDelta) await changeScore(post.userId, ownerDelta);
        if (voterDelta) await changeScore(req.user._id, voterDelta);
      } catch (repErr) {
        console.error('Reputation update failed:', repErr);
      }
    };

    if (existingIndex > -1) {
      const existing = post.votes[existingIndex];
      if (existing.value === value) {
        // toggle remove vote
        post.votes.splice(existingIndex, 1);
        await post.save();

        // revert reputation
        if (value === 1) {
          await applyReputation(-10, -2);
        } else {
          await applyReputation(+2, 0);
        }

        const populatedPost = await Post.findById(post._id).populate(
          'userId',
          'username avatar score'
        );
        return res.json(populatedPost);
      } else {
        // switch vote (e.g., +1 -> -1)
        if (existing.value === 1) {
          await applyReputation(-10, -2); // revert old upvote
        } else {
          await applyReputation(+2, 0); // revert old downvote
        }
        post.votes[existingIndex].value = value;
      }
    } else {
      // new vote
      post.votes.push({ userId: req.user._id, value });
    }

    // apply new vote reputation
    if (value === 1) {
      if (uid !== ownerId) await applyReputation(10, 2);
      else await applyReputation(10, 0); // self-upvote only gives owner +10
    } else {
      await applyReputation(-2, 0);
    }

    await post.save();
    const populated = await Post.findById(post._id).populate(
      'userId',
      'username avatar score'
    );
    res.json(populated);
  } catch (err) {
    console.error('Error voting on post:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
