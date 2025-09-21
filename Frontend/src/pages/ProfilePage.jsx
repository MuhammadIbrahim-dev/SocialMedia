import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../redux/userSlice";
import { fetchPostsByUser } from "../redux/PostSlice";
import { fetchCommentsByUser } from "../redux/CommentSlice";
import PostCard from "../components/PostCard";
import { FiEdit, FiMessageCircle } from "react-icons/fi";

export default function Profile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("posts"); // "posts" or "comments"

  const { current: user, status: userStatus } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);
  const { userPosts, userPostsStatus } = useSelector((state) => state.posts);
  const { userComments, userCommentsStatus } = useSelector((state) => state.comments);
  
  // Check if this is the current user's profile
  const isOwnProfile = currentUser && user && 
    String(currentUser._id || currentUser.id) === String(user._id);
  
  const [imageError, setImageError] = useState(false);

  // Get fallback avatar URL
  const getFallbackAvatar = (name = 'User') => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=ffffff&size=400`;
  };

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchUser(id));
      dispatch(fetchPostsByUser(id));
      dispatch(fetchCommentsByUser(id));
    }
  }, [id, dispatch]);

  if (userStatus === "loading" || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      {/* Profile Card */}
      <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col sm:flex-row items-center gap-8 hover:shadow-2xl transition-all duration-300">
        <div className="relative">
          <img
            src={imageError ? getFallbackAvatar(user.name) : (user.avatar || getFallbackAvatar(user.name))}
            alt={`${user.name}'s avatar`}
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-200 shadow-lg hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
          <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 text-xs rounded-full shadow-md">
            {user.score} pts
          </span>
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow">
              {user.name}
            </h1>
            {isOwnProfile && (
              <Link
                to="/edit-profile"
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
                title="Edit Profile"
              >
                <FiEdit size={20} />
              </Link>
            )}
          </div>
          <p className="text-slate-500 text-sm mb-2">@{user.username}</p>
          <p className="mt-2 text-slate-600 italic">
            {user.bio || "This user hasn't written a bio yet."}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "posts"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            📝 Posts ({userPosts.length})
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === "comments"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <FiMessageCircle className="inline mr-2" />
            Comments ({userComments.length})
          </button>
        </div>

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div>
            {userPostsStatus === "loading" ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-slate-500">Loading posts...</p>
              </div>
            ) : userPosts.length > 0 ? (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 italic">
                  {user.name} hasn't created any posts yet.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <div>
            {userCommentsStatus === "loading" ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-slate-500">Loading comments...</p>
              </div>
            ) : userComments.length > 0 ? (
              <div className="space-y-4">
                {userComments.map((comment) => (
                  <div key={comment._id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <img
                          src={comment.postId?.image || "https://ui-avatars.com/api/?name=Post&background=e5e7eb&color=374151&size=40"}
                          alt="Post thumbnail"
                          className="w-10 h-10 rounded object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Link 
                            to={`/post/${comment.postId?._id}`}
                            className="font-medium text-slate-900 hover:text-blue-600 transition-colors"
                          >
                            {comment.postId?.title || "Post"}
                          </Link>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm text-slate-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 italic">
                  {user.name} hasn't made any comments yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
