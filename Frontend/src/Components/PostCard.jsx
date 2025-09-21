import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";
import { votePost } from "../redux/PostSlice";


export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const votes = post.votes?.reduce((s, v) => s + v.value, 0) || 0;

  const handleVote = (value) => {
    dispatch(votePost({ id: post._id, value }));
  };

  return (
    <article className="flex gap-4 border border-gray-200 rounded-2xl mb-6 shadow-md bg-white hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1">
      {/* Voting Sidebar */}
      <div className="flex flex-col items-center justify-center px-4 py-6 bg-gradient-to-b from-blue-50 to-white rounded-l-2xl">
        <button
          onClick={() => handleVote(1)}
          className="p-2 rounded-full hover:bg-blue-100 transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <FiArrowUp className="text-gray-500 hover:text-blue-600 text-2xl transition-colors" />
        </button>
        <span className="font-bold text-lg text-blue-700 my-2 animate-pulse">
          {votes}
        </span>
        <button
          onClick={() => handleVote(-1)}
          className="p-2 rounded-full hover:bg-red-100 transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <FiArrowDown className="text-gray-500 hover:text-red-500 text-2xl transition-colors" />
        </button>
      </div>

      {/* Post Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2 hover:text-blue-700 transition-colors">
            <Link to={`/post/${post._id}`}>{post.title}</Link>
          </h3>

          {post.content && (
            <p className="text-gray-600 leading-relaxed line-clamp-3">
              {post.content.length > 180
                ? post.content.slice(0, 180) + "..."
                : post.content}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium hover:bg-blue-200 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 text-sm text-gray-500 flex justify-between items-center border-t pt-3">
          <span className="flex items-center gap-1">
            👤 {post.userId?.username || "Anonymous"}
          </span>
          <span className="italic">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </article>
  );
}
