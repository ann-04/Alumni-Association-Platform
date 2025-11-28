import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, GraduationCap, BookOpen, Users } from 'lucide-react';
// import { useStore } from '../store'; // Commented out unused imports
// import { API } from '../../config'; // Commented out unused imports
import { motion } from 'framer-motion';

const Signup = ({setIsAuthenticated}) => {
  // const { user } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneVisibility, setPhoneVisibility] = useState('PUBLIC');
  const [role, setRole] = useState('ALUMNI'); // Default to ALUMNI
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Create account
      await axios.post(
        'http://localhost:3000/api/user/signup',
        { name, email, password, phone, phoneVisibility, role },
        { withCredentials: true }
      );

      // Step 2: Auto-login after signup
      const loginRes = await axios.post(
        'http://localhost:3000/api/user/signin',
        { email, password },
        { withCredentials: true }
      );

      setLoading(false);
      alert('Signup successful! Logged in automatically.');

      // Step 3: Save auth state & user info
      setIsAuthenticated(true);
      localStorage.setItem('isAuthenticated', true);
      if (loginRes.data?.user) {
        localStorage.setItem('user', JSON.stringify(loginRes.data.user));
      }

      // Step 4: Redirect
      navigate('/profile');
    } catch (err) {
      setLoading(false);
      console.error('Error while signing up! ', err);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    // Main section with theme background
    <section className="relative min-h-screen flex items-center justify-center py-10 px-4">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900 via-indigo-900 to-violet-900 opacity-80"></div>

        {/* Alumni background elements */}
        <div className="absolute top-20 left-10 opacity-30 text-indigo-100">
          <GraduationCap size={80} strokeWidth={1} />
        </div>
        <div className="absolute bottom-20 right-20 opacity-25 text-cyan-100 rotate-12">
          <BookOpen size={100} strokeWidth={1} />
        </div>
        <div className="absolute top-1/2 left-5 opacity-20 text-violet-200 -translate-y-1/2">
          <Users size={120} strokeWidth={0.5} />
        </div>
        <div className="absolute bottom-32 left-1/3 opacity-25 text-indigo-100 -rotate-6">
          <GraduationCap size={60} strokeWidth={1} />
        </div>
      </div>

      {/* Signup Form */}
      <motion.div
        className="z-10 bg-white rounded-xl shadow-2xl p-6 sm:p-10 xl:mx-auto xl:w-full xl:max-w-md 2xl:max-w-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo Icon */}
        <div className="mb-6 flex justify-center">
          <svg
            width="50"
            height="56"
            viewBox="0 0 50 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.2732 0.2528C20.8078 1.18964..."
              fill="url(#paint1_linear_1_2)"
            />
            <defs>
              <linearGradient
                id="paint1_linear_1_2"
                x1="2.12023"
                y1="27.7665"
                x2="48.2229"
                y2="27.7665"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h2 className="text-center text-3xl font-extrabold leading-tight text-indigo-700">
          Create Your Alumni Account
        </h2>
        <p className="mt-2 text-center text-base text-gray-600">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-all duration-200"
          >
            Sign In
          </Link>
        </p>

        {/* Form */}
        <form onSubmit={handleSignup} className="mt-8">
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="text-base font-medium text-gray-900">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  onChange={(e) => setName(e.target.value)}
                  className="flex h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="text-base font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="text-base font-medium text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Create a password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                />
              </div>
            </div>

            {/* Phone + Visibility */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="text-base font-medium text-gray-900">
                  Phone Number
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="E.g., 9876543210"
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="visibility" className="text-base font-medium text-gray-900">
                  Phone Visibility
                </label>
                <div className="mt-2">
                  <select
                    id="visibility"
                    value={phoneVisibility}
                    onChange={(e) => setPhoneVisibility(e.target.value)}
                    className="flex h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="text-base font-medium text-gray-900">
                Account Type
              </label>
              <div className="mt-2">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="flex h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300"
                >
                  <option value="ALUMNI">Alumni</option>
                  <option value="STUDENT">Current Student</option>
                  <option value="FACULTY">Faculty Member</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-indigo-600 hover:to-cyan-500 text-white px-3.5 py-3 font-semibold leading-7 shadow-lg transition duration-300 transform hover:scale-[1.01] disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 rounded-full animate-spin border-4 border-solid border-white border-t-transparent shadow-md"></div>
                ) : (
                  <>
                    Create Account <ArrowRight className="ml-2" size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </section>
  );
};

export default Signup;
