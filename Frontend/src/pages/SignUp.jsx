import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Signup } from '../redux/AuthSlice/Auth.Slice';

export default function SignUp() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
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
      const res = await dispatch(Signup(formData)).unwrap();
      toast.success('Account created successfully! 🎉');
      console.log('Signup success:', res);
    } catch (err) {
      toast.error(err.message || 'User already exists or registration failed!');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md animate-[fadeIn_0.5s_ease-out] rounded-2xl bg-white p-8 text-center shadow-xl sm:p-10">
        <h1 className="mb-6 text-3xl font-bold text-blue-600">Create Account</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* name */}
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              id="name"
              placeholder="name"
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-base transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-base transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
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
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pl-11 pr-11 text-base transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="transform rounded-lg cursor-pointer bg-blue-600 py-3 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 active:translate-y-0"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/signin" className="font-semibold text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
