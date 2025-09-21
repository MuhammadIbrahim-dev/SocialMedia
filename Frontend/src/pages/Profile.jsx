import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchUser } from "../redux/userSlice";
import PostCard from "../components/PostCard";

export default function Profile() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { current: user, status } = useSelector((state) => state.users);
  const allPosts = useSelector((state) => state.posts.items);

  useEffect(() => {
    if (id) {
      dispatch(fetchUser(id));
    }
  }, [id, dispatch]);

  // Fix: handle both populated and ObjectId userId
  const userPosts = allPosts.filter(
    (post) => String(post.userId?._id || post.userId)
  );

  if (status === "loading" || !user) {
    return (
      <p className="text-center mt-10 text-lg text-slate-500 animate-pulse">
        Loading profile...
      </p>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4">
      {/* Profile Card */}
      <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col sm:flex-row items-center gap-8 hover:shadow-2xl transition-all duration-300">
        <div className="relative">
          <img
            src={
              user.avatar ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            }
            alt={`${user.name}'s avatar`}
            className="w-28 h-28 rounded-full object-cover border-4 border-indigo-200 shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 text-xs rounded-full shadow-md">
            {user.score} pts
          </span>
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow">
            {user.name}
          </h1>
          <p className="mt-2 text-slate-600 italic">
            {user.bio || "This user hasn’t written a bio yet."}
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
          📝 Posts
        </h2>
        {userPosts.length > 0 ? (
          <div className="space-y-6">
            {userPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 italic">
            {user.name} hasn’t created any posts yet.
          </p>
        )}
      </div>
    </main>
  );
}
