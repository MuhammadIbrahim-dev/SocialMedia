import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiArrowUp, FiArrowDown, FiMessageCircle, FiClock, FiUser } from "react-icons/fi";
import { votePost } from "../redux/PostSlice";


export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const votes = post.votes?.reduce((s, v) => s + v.value, 0) || 0;

  const handleVote = (value) => {
    dispatch(votePost({ id: post._id, value }));
  };

  return (
    <article className="flex gap-0 overflow-hidden">
      {/* Voting Sidebar */}
      <div className="flex flex-col items-center justify-center px-6 py-8 bg-gradient-to-b from-purple-500/20 to-pink-500/20 border-r border-white/10">
        <button
          onClick={() => handleVote(1)}
          className="p-3 rounded-full hover:bg-emerald-500/20 transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <FiArrowUp className="text-slate-300 group-hover:text-emerald-400 text-2xl transition-colors" />
        </button>
        <span className="font-bold text-2xl text-white my-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {votes}
        </span>
        <button
          onClick={() => handleVote(-1)}
          className="p-3 rounded-full hover:bg-red-500/20 transition-all duration-300 hover:scale-110 active:scale-95 group"
        >
          <FiArrowDown className="text-slate-300 group-hover:text-red-400 text-2xl transition-colors" />
        </button>
      </div>

      {/* Post Content */}
      <div className="p-8 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-white mb-4 hover:text-purple-300 transition-colors group">
            <Link to={`/post/${post._id}`} className="group-hover:underline decoration-purple-400">
              {post.title}
            </Link>
          </h3>

          {post.content && (
            <p className="text-slate-300 leading-relaxed mb-6" style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {post.content.length > 200
                ? post.content.slice(0, 200) + "..."
                : post.content}
            </p>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-3 mb-6">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-4 py-2 rounded-full font-medium hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 cursor-pointer border border-purple-500/30"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <FiUser className="text-white text-sm" />
            </div>
            <span className="text-slate-300 font-medium">
              {post.userId?.username || "Anonymous"}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-2">
              <FiMessageCircle className="text-lg" />
              <span className="text-sm">{post.comments?.length || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="text-lg" />
              <span className="text-sm">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
