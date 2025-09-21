import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchUser } from "../redux/userSlice";
import { fetchPostsByUser } from "../redux/PostSlice";
import { fetchCommentsByUser } from "../redux/CommentSlice";
import PostCard from "../components/PostCard";
import { FiEdit, FiMessageCircle } from "react-icons/fi";

export default function Profile() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { current: user, status: userStatus } = useSelector(
    (state) => state.users
  );
  const { user: currentUser } = useSelector((state) => state.auth);
  const { userPosts = [], userPostsStatus } = useSelector((state) => state.posts);
  const { userComments = [], userCommentsStatus } = useSelector(
    (state) => state.comments
  );

  const [imageError, setImageError] = useState(false);

  // Check if this is the current user's profile
  const isOwnProfile =
    currentUser &&
    user &&
    String(currentUser._id || currentUser.id) === String(user._id);

  // Get fallback avatar URL
  const getFallbackAvatar = (name = "User") =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=6366f1&color=ffffff&size=400`;

  const handleImageError = () => setImageError(true);

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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto py-12 px-4">
        {/* Profile Card */}
        <div className="relative mb-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-30"></div>
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-50"></div>
                <img
                  src={
                    imageError
                      ? getFallbackAvatar(user.name)
                      : user.avatar || getFallbackAvatar(user.name)
                  }
                  alt={`${user.name}'s avatar`}
                  className="relative w-32 h-32 rounded-full object-cover border-4 border-white/30 shadow-2xl hover:scale-105 transition-transform duration-300"
                  onError={handleImageError}
                />
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg border-2 border-white/20">
                  {user.score} pts
                </div>
              </div>

              <div className="text-center lg:text-left flex-1">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                  <h1 className="text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent drop-shadow-2xl">
                    {user.name}
                  </h1>
                  {isOwnProfile && (
                    <Link
                      to="/edit-profile"
                      className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white border border-white/20 transition-all duration-300 hover:scale-110"
                      title="Edit Profile"
                    >
                      <FiEdit size={20} />
                    </Link>
                  )}
                </div>
                <p className="text-purple-300 text-lg mb-4 font-medium">
                  @{user.username}
                </p>
                <p className="text-slate-300 text-lg leading-relaxed max-w-2xl">
                  {user.bio || "This user hasn't written a bio yet."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Posts */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">📝</span>
                </div>
                Posts ({userPosts.length})
              </h2>
              {userPostsStatus === "loading" ? (
                <p className="text-slate-300">Loading posts...</p>
              ) : userPosts.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {userPosts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-300 italic">
                  {user.name} hasn’t created any posts yet.
                </p>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20"></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <FiMessageCircle className="text-white text-lg" />
                </div>
                Comments ({userComments.length})
              </h2>
              {userCommentsStatus === "loading" ? (
                <p className="text-slate-300">Loading comments...</p>
              ) : userComments.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {userComments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <img
                            src={
                              comment.postId?.image ||
                              "https://ui-avatars.com/api/?name=Post&background=6366f1&color=ffffff&size=40"
                            }
                            alt="Post thumbnail"
                            className="w-10 h-10 rounded-lg object-cover border border-white/20"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Link
                              to={`/post/${comment.postId?._id}`}
                              className="font-medium text-white hover:text-purple-300 transition-colors truncate"
                            >
                              {comment.postId?.title || "Post"}
                            </Link>
                            <span className="text-slate-400">•</span>
                            <span className="text-sm text-slate-400 whitespace-nowrap">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm line-clamp-3">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-300 italic">
                  {user.name} hasn’t made any comments yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
