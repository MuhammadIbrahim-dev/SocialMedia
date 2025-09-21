import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPost,
  votePost,
  updatePost,
  deletePost,
} from "../redux/PostSlice.jsx";
import { fetchComments, addComment } from "../redux/CommentSlice";
import {
  FiArrowUp,
  FiArrowDown,
  FiEdit,
  FiTrash2,
  FiSave,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";

export default function PostPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({ title: "", content: "" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const { current: post, status: postStatus } = useSelector(
    (state) => state.posts
  );
  const { items: comments = [] } = useSelector((state) => state.comments);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchPost(id));
      dispatch(fetchComments(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (post) {
      setEditedPost({ title: post.title, content: post.content });
      setValidationErrors({});
      setUpdateError(null);
      setDeleteError(null);
    }
  }, [post]);

  // ownership logic
  const isOwner =
    user && post && String(user._id || user.id) === String(post.userId?._id);

  // validation
  const validatePost = (postData) => {
    const errors = {};
    if (!postData.title?.trim()) {
      errors.title = "Title is required";
    } else if (postData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters long";
    }
    if (!postData.content?.trim()) {
      errors.content = "Content is required";
    } else if (postData.content.trim().length < 10) {
      errors.content = "Content must be at least 10 characters long";
    }
    return errors;
  };

  const hasChanges = () =>
    post &&
    (editedPost.title !== post.title || editedPost.content !== post.content);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      await dispatch(addComment({ postId: id, content: newComment }));
      setNewComment("");
    }
  };

  const handleVote = (value) => {
    if (post?._id) dispatch(votePost({ id: post._id, value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setValidationErrors({});

    if (!isOwner) {
      setUpdateError("You are not authorized to update this post");
      return;
    }
    if (!hasChanges()) {
      setUpdateError("No changes detected");
      return;
    }

    const errors = validatePost(editedPost);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsUpdating(true);
    try {
      const result = await dispatch(
        updatePost({
          id: post._id,
          title: editedPost.title.trim(),
          content: editedPost.content.trim(),
        })
      );
      if (updatePost.fulfilled.match(result)) {
        setIsEditing(false);
      } else {
        setUpdateError(result.payload?.message || "Failed to update post");
      }
    } catch {
      setUpdateError("Unexpected error while updating");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleteError(null);
    if (!isOwner) {
      setDeleteError("You are not authorized to delete this post");
      return;
    }
    const confirmed = window.confirm(
      `Delete this post?\n\n"${post.title}"\n\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const result = await dispatch(deletePost(post._id));
      if (deletePost.fulfilled.match(result)) {
        navigate("/");
      } else {
        setDeleteError(result.payload?.message || "Failed to delete post");
      }
    } catch {
      setDeleteError("Unexpected error while deleting");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditChange = (e) => {
    setEditedPost({ ...editedPost, [e.target.name]: e.target.value });
    if (validationErrors[e.target.name]) {
      setValidationErrors({ ...validationErrors, [e.target.name]: null });
    }
  };

  const handleCancelEdit = () => {
    if (hasChanges() && !window.confirm("Discard changes?")) return;
    setIsEditing(false);
    setEditedPost({ title: post.title, content: post.content });
    setValidationErrors({});
    setUpdateError(null);
  };

  const votes = post?.votes?.reduce((s, v) => s + v.value, 0) || 0;

  if (postStatus === "loading" || !post) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading post...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto py-12 px-4">
        {/* Post */}
        <article className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-30"></div>
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8 flex gap-4">
            {/* Vote bar */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleVote(1)}
                className="p-2 rounded-md hover:bg-blue-100 text-slate-500 hover:text-blue-600"
              >
                <FiArrowUp size={20} />
              </button>
              <span className="font-bold text-lg">{votes}</span>
              <button
                onClick={() => handleVote(-1)}
                className="p-2 rounded-md hover:bg-blue-100 text-slate-500 hover:text-blue-600"
              >
                <FiArrowDown size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow">
              {isEditing ? (
                <form onSubmit={handleUpdate}>
                  {updateError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <FiAlertCircle className="text-red-500" />
                      <span className="text-red-700 text-sm">{updateError}</span>
                    </div>
                  )}
                  <input
                    type="text"
                    name="title"
                    value={editedPost.title}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg p-3 text-3xl font-bold mb-4"
                    disabled={isUpdating}
                  />
                  {validationErrors.title && (
                    <p className="text-sm text-red-600">
                      {validationErrors.title}
                    </p>
                  )}
                  <textarea
                    name="content"
                    value={editedPost.content}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg p-3 h-48"
                    disabled={isUpdating}
                  />
                  {validationErrors.content && (
                    <p className="text-sm text-red-600">
                      {validationErrors.content}
                    </p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
                    >
                      {isUpdating ? "Updating..." : <><FiSave /> Save</>}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg flex items-center gap-2"
                    >
                      <FiX /> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold text-slate-900">
                      {post.title}
                    </h1>
                    {isOwner && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-md"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={handleDelete}
                          className="p-2 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-md"
                        >
                          {isDeleting ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FiTrash2 />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {post.content}
                  </p>
                  {deleteError && (
                    <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                      <FiAlertCircle /> {deleteError}
                    </div>
                  )}
                </>
              )}

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-4">
                <Link to={`/profile/${post.userId?._id}`}>
                  <img
                    src={
                      post.userId?.avatar ||
                      "https://www.gravatar.com/avatar/?d=mp"
                    }
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </Link>
                <div className="text-sm">
                  <p className="text-slate-500">Posted by</p>
                  <Link
                    to={`/profile/${post.userId?._id}`}
                    className="font-semibold text-slate-800 hover:text-blue-600"
                  >
                    {post.userId?.username || "Unknown"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Comments */}
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-slate-900">
            Comments ({comments.length})
          </h2>
          <form onSubmit={handleAddComment}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="Write a comment..."
              rows="3"
            />
            <button
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg"
              disabled={!newComment.trim()}
            >
              Add Comment
            </button>
          </form>
          <div className="mt-6 space-y-6">
            {comments.map((c) => (
              <div key={c._id} className="flex gap-4 border-t pt-6">
                <Link to={`/profile/${c.userId?._id}`}>
                  <img
                    src={
                      c.userId?.avatar ||
                      "https://www.gravatar.com/avatar/?d=mp"
                    }
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </Link>
                <div className="flex-grow">
                  <p className="font-semibold text-slate-800">
                    {c.userId?.name || "User"}
                  </p>
                  <p className="text-slate-600 mt-1">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
