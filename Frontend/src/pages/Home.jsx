import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/PostSlice";
import PostCard from "../components/PostCard";

export default function Home() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.items);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-blue-700 animate-fade-in">
          📢 Community Feed
        </h1>
        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post, i) => (
              <div
                key={post._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <PostCard post={post} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No posts yet. Be the first!</p>
          )}
        </div>
      </div>
    </main>
  );
}
