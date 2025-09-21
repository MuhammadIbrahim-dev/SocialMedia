import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { logout } from "../redux/AuthSlice/Auth.Slice";
import { FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-lg">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link
          to="/"
          className="font-extrabold text-2xl cursor-pointer text-white tracking-wide hover:scale-105 transition-transform"
        >
          Creato
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center text-white font-medium">
          <Link
            to="/leaderboard"
            className="hover:text-yellow-300 cursor-pointer transition-colors"
          >
            Leaderboard
          </Link>
          {user ? (
            <>
              <Link
                to="/create"
                className="px-4 py-2 rounded-full cursor-pointer bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-md hover:shadow-lg transition-all"
              >
                + Create Post
              </Link>
              <Link
                to={`/profile/${user.id}`}
                className="hover:text-yellow-300 cursor-pointer transition-colors"
              >
                {user.name}
              </Link>
              <button
                onClick={() => dispatch(logout())}
                className="px-4 py-2 rounded-full cursor-pointer bg-gradient-to-r from-red-400 to-rose-600 text-white shadow-md hover:shadow-lg transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="hover:text-yellow-300 cursor-pointer transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-full cursor-pointer bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md hover:shadow-lg transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition"
        >
          {isOpen ? <FiX className="cursor-pointer text-2xl" /> : <FiMenu className="cursor-pointer text-2xl" />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <nav className="md:hidden bg-white/10 backdrop-blur-lg border-t border-white/20 shadow-xl animate-slide-down">
          <div className="flex flex-col gap-4 p-6 text-white font-medium">
            <Link
              to="/leaderboard"
              className="hover:text-yellow-300 cursor-pointer transition-colors cursor-pointer"
              onClick={toggleMenu}
            >
              Leaderboard
            </Link>
            {user ? (
              <>
                <Link
                  to="/create"
                  className="px-4 py-2 rounded-full bg-gradient-to-r cursor-pointer from-green-400 to-emerald-600 text-white shadow-md hover:shadow-lg transition-all"
                  onClick={toggleMenu}
                >
                  + Create Post
                </Link>
                <Link
                  to={`/profile/${user.id}`}
                  className="hover:text-yellow-300 cursor-pointer transition-colors"
                  onClick={toggleMenu}
                >
                  {user.name}
                </Link>
                <button
                  onClick={() => {
                    dispatch(logout());
                    toggleMenu();
                  }}
                  className="px-4 py-2 cursor-pointer rounded-full bg-gradient-to-r from-red-400 to-rose-600 text-white shadow-md hover:shadow-lg transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="hover:text-yellow-300 cursor-pointer transition-colors"
                  onClick={toggleMenu}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full cursor-pointer bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md hover:shadow-lg transition-all"
                  onClick={toggleMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
