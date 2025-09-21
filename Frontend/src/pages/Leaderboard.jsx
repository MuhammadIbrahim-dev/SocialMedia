import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeaderboard } from "../redux/leaderboard";
import { FaCrown } from "react-icons/fa";

export default function Leaderboard() {
  const dispatch = useDispatch();
  const { users, status } = useSelector((state) => state.leaderboard);

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  if (status === "loading") {
    return <p className="text-center mt-8 text-lg text-slate-600">Loading leaderboard...</p>;
  }

  // Color badges for top 3
  const getRankStyles = (rank) => {
    if (rank === 0) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg";
    if (rank === 1) return "bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-md";
    if (rank === 2) return "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md";
    return "bg-slate-100 text-slate-700";
  };

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow">
        🏆 Leaderboard
      </h1>
      <ol className="space-y-4">
        {users.map((u, i) => (
          <li
            key={u._id}
            className="flex justify-between items-center p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02]"
          >
            {/* Left side: Rank + Name */}
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${getRankStyles(i)}`}
              >
                {i === 0 ? <FaCrown className="text-yellow-100 text-xl" /> : `#${i + 1}`}
              </div>
              <span className="text-lg font-semibold text-slate-800">{u.username || u.name}</span>
            </div>

            {/* Right side: Score */}
            <span className="text-xl font-bold text-indigo-600">{u.score}</span>
          </li>
        ))}
      </ol>
    </main>
  );
}
