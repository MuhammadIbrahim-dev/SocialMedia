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
import { FiArrowUp, FiArrowDown, FiEdit, FiTrash2 } from "react-icons/fi";

export default function PostPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({ title: "", content: "" });

  const { current: post, status: postStatus } = useSelector(
    (state) => state.posts
  );
  const { items: comments, status: commentsStatus } = useSelector(
    (state) => state.comments
  );
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
    }
  }, [post]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      // The backend should ideally return the populated comment.
      // For now, we'll just add the unpopulated one and let a refresh fix it.
      // A better solution is to have the backend return the populated comment.
      await dispatch(addComment({ postId: id, content: newComment }));
      setNewComment("");
    }
  };

  const handleVote = (value) => {
    dispatch(votePost({ id: post._id, value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await dispatch(updatePost({ id: post._id, ...editedPost }));
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await dispatch(deletePost(post._id));
      navigate("/");
    }
  };

  const handleEditChange = (e) => {
    setEditedPost({ ...editedPost, [e.target.name]: e.target.value });
  };

  const votes = post?.votes?.reduce((s, v) => s + v.value, 0) || 0;
  const isOwner = user && post && user.id === post.userId?._id;

  if (postStatus === "loading" || !post) {
    return <p className="text-center mt-8">Loading post...</p>;
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <article className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex gap-4">
          <div className="flex flex-col items-center text-center pt-1">
            <button onClick={() => handleVote(1)} className="p-2 rounded-md cursor-pointer hover:bg-blue-100 text-slate-500 hover:text-blue-600 transition-colors"><FiArrowUp size={20} /></button>
            <span className="font-bold text-lg">{votes}</span>
            <button onClick={() => handleVote(-1)} className="p-2 rounded-md cursor-pointer hover:bg-blue-100 text-slate-500 hover:text-blue-600 transition-colors"><FiArrowDown size={20} /></button>
          </div>
          <div className="flex-grow">
            {isEditing ? (
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  name="title"
                  value={editedPost.title}
                  onChange={handleEditChange}
                  className="w-full border border-slate-300 rounded-lg p-3 text-3xl font-bold mb-4 text-slate-900"
                />
                <textarea
                  name="content"
                  value={editedPost.content}
                  onChange={handleEditChange}
                  className="w-full border border-slate-300 rounded-lg p-3 h-48"
                  rows="10"
                />
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl font-bold mb-4 text-slate-900">{post.title}</h1>
                  {isOwner && (
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditing(true)} className="p-2 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700">
                        <FiEdit size={18} />
                      </button>
                      <button onClick={handleDelete} className="p-2 rounded-md hover:bg-red-100 text-slate-500 hover:text-red-600">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
              </>
            )}
            <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-4">
              <Link to={`/profile/${post.userId?._id}`}>
                <img
                  src={post.userId?.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                  alt={`${post.userId?.name || 'user'}'s avatar`}
                  className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-indigo-500 transition-all"
                />
              </Link>
              <div className="text-sm">
                <p className="text-slate-500">Posted by</p>
                <Link to={`/profile/${post.userId?._id}`} className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">{post.userId?.username || "Unknown"}</Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <section className="mt-8 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">Comments ({comments.length})</h2>
        <form onSubmit={handleAddComment} className="mt-4">
          <textarea 
            value={newComment} 
            onChange={(e) => setNewComment(e.target.value)} 
            className="w-full border border-slate-300 rounded-lg p-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
            placeholder="Write a comment..."
            rows="3"
          />
          <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-sm hover:shadow-md disabled:bg-slate-400" disabled={!newComment.trim()}>Add Comment</button>
        </form>
        <div className="mt-6 space-y-6">
          {comments.map((c) => (
            <div key={c._id} className="flex gap-4 border-t border-slate-200 pt-6 first:border-t-0 first:pt-0">
              <Link to={`/profile/${c.userId?._id}`}>
                <img
                  src={c.userId?.avatar || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                  alt={`${c.userId?.name || 'user'}'s avatar`}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </Link>
              <div className="flex-grow">
                <p className="font-semibold text-slate-800">{c.userId?.name || (c.userId === user?.id ? user.name : "User")}</p>
                <p className="text-slate-600 mt-1">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
