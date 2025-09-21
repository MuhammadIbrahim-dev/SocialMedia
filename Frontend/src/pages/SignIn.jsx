import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Login } from '../redux/AuthSlice/Auth.Slice';

export default function SignIn() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(Login(formData)).unwrap();
      console.log('Login success:', res);
    } catch (err) {
      toast.error(err.message || 'User does not exist!');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md animate-[fadeIn_0.5s_ease-out] rounded-2xl bg-white p-8 text-center shadow-lg sm:p-10">
        <h1 className="mb-6 text-3xl font-bold text-indigo-600">Welcome Back!</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-11 pr-4 text-base transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          {/* Password with toggle */}
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-11 pr-11 text-base transition-all duration-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="transform rounded-lg cursor-pointer bg-indigo-600 py-3 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
