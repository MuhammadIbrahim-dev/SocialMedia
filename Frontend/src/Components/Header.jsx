import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiLogIn, FiUserPlus, FiUser, FiLogOut, FiMessageSquare } from 'react-icons/fi';
import { logout } from '../redux/AuthSlice/Auth.Slice';

export default function Header() {
  const { user } = useSelector((state) => state.auth);
 const dispatch = useDispatch();
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 sm:px-8 py-4 shadow-md transition-colors duration-300">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
        <FiMessageSquare />
        Connecto
      </Link>
      <nav className="flex items-center gap-2 sm:gap-6">
        {user ? (
          <>
            <Link to="/profile" className="flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-gray-700 transition-all duration-300 hover:bg-indigo-600 hover:text-white"><FiUser /> Profile</Link>
            <span className="flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-gray-700 transition-all duration-300 hover:bg-indigo-600 hover:text-white" onClick={() => dispatch(logout())}><FiLogOut /> Logout</span>
          </>

        ) : (
          <>
            <Link to="/signin" className="flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-gray-700 transition-all duration-300 hover:bg-indigo-600 hover:text-white"><FiLogIn /> Sign In</Link>
            <Link to="/signup" className="flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 font-semibold text-white transition-all duration-300 hover:opacity-90"><FiUserPlus /> Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}