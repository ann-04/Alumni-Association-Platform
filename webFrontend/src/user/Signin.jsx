import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
// import { useStore } from '../store'; // Commented out unused import
// import { API } from '../../config'; // Commented out unused import
import { motion } from 'framer-motion';

const Signin = ({ setIsAuthenticated }) => {
    // const { user } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // Use the actual API URL from a configuration or environment variable if available
            const response = await axios.post(
                'http://localhost:3000/api/user/signin',
                { email, password },
                { withCredentials: true }
            );
            setLoading(false);
            const { user, profileExists, studentExists, facultyExists } = response.data;
    
            alert('Signin successful!');
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', true);
            localStorage.setItem('user',JSON.stringify(user));
    
            // Navigation logic
            if (profileExists) {
                if (user.role === 'STUDENT' || user.role === 'ALUMNI') {
                    if (studentExists) {
                        navigate('/profile');
                    } else {
                        navigate('/addStudent');
                    }
                } else if (user.role === 'FACULTY') {
                    if (facultyExists) {
                        navigate('/profile');
                    } else {
                        navigate('/addFaculty');
                    }
                } else if (user.role === 'ADMIN') {
                    navigate('/profile');
                }
            } else {
                navigate('/addProfile');
            }
        } catch (error) {
            console.error('Error while signing in! ', error);
            alert('Invalid credentials!');
            setLoading(false);
        }
    };

    return (
        // Main section with theme background
        <section className='relative min-h-screen flex items-center justify-center py-10 px-4'>
            {/* Background Gradient Overlay */}
            <div className="absolute inset-0 z-0 bg-gray-900">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-900 via-indigo-900 to-violet-900 opacity-80"></div>
            </div>

            {/* Signin Form Container */}
            <motion.div
                className='z-10 bg-white rounded-xl shadow-2xl p-6 sm:p-10 xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className='mb-6 flex justify-center'>
                    {/* Icon with Theme Color */}
                    <svg
                        width='50'
                        height='56'
                        viewBox='0 0 50 56'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                    >
                        <path
                            d='M23.2732 0.2528C20.8078 1.18964 2.12023 12.2346 1.08477 13.3686C0 14.552 0 14.7493 0 27.7665C0 39.6496 0.0986153 41.1289 0.83823 42.0164C2.12023 43.5449 23.2239 55.4774 24.6538 55.5267C25.9358 55.576 46.1027 44.3832 48.2229 42.4602C49.3077 41.474 49.3077 41.3261 49.3077 27.8158C49.3077 14.3055 49.3077 14.1576 48.2229 13.1714C46.6451 11.7415 27.1192 0.450027 25.64 0.104874C24.9497 -0.0923538 23.9142 0.00625992 23.2732 0.2528ZM20.2161 21.8989C20.2161 22.4906 18.9835 23.8219 17.0111 25.3997C15.2361 26.7803 13.8061 27.9637 13.8061 28.0623C13.8061 28.1116 15.2361 29.0978 16.9618 30.2319C18.6876 31.3659 20.2655 32.6479 20.4134 33.0917C20.8078 34.0286 19.871 35.2119 18.8355 35.2119C17.8001 35.2119 9.0233 29.3936 8.67815 28.5061C8.333 27.6186 9.36846 26.5338 14.3485 22.885C17.6521 20.4196 18.4904 20.0252 19.2793 20.4196C19.7724 20.7155 20.2161 21.3565 20.2161 21.8989ZM25.6893 27.6679C23.4211 34.9161 23.0267 35.7543 22.1391 34.8668C21.7447 34.4723 22.1391 32.6479 23.6677 27.9637C26.2317 20.321 26.5275 19.6307 27.2671 20.3703C27.6123 20.7155 27.1685 22.7864 25.6893 27.6679ZM36.0932 23.2302C40.6788 26.2379 41.3198 27.0269 40.3337 28.1609C39.1503 29.5909 31.6555 35.2119 30.9159 35.2119C29.9298 35.2119 28.9436 33.8806 29.2394 33.0424C29.3874 32.6479 30.9652 31.218 32.7403 29.8867L35.9946 27.4706L32.5431 25.1532C30.6201 23.9205 29.0915 22.7371 29.0915 22.5892C29.0915 21.7509 30.2256 20.4196 30.9159 20.4196C31.3597 20.4196 33.6771 21.7016 36.0932 23.2302Z'
                            fill='url(#paint0_linear_1_2)' // Use a fill with the theme gradient
                        />
                        <defs>
                            <linearGradient id="paint0_linear_1_2" x1="2.12023" y1="27.7665" x2="48.2229" y2="27.7665" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#3b82f6" /> {/* Blue/Cyan */}
                                <stop offset="1" stopColor="#6366f1" /> {/* Indigo */}
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h2 className='text-center text-3xl font-extrabold leading-tight text-indigo-700'>
                    Log in to Your Alumni Account
                </h2>
                <p className='mt-2 text-center text-base text-gray-600 '>
                    Don&apos;t have an account?{' '}
                    <Link
                        to='/signup'
                        title=''
                        className='font-semibold text-indigo-600 transition-all duration-200 hover:text-indigo-800 hover:underline'
                    >
                        Sign up
                    </Link>
                </p>
                <form
                    action='#'
                    method='POST'
                    onSubmit={handleSignin}
                    className='mt-8'
                >
                    <div className='space-y-5'>
                        <div>
                            <label
                                htmlFor='email'
                                className='text-base font-medium text-gray-900'
                            >
                                Email address
                            </label>
                            <div className='mt-2'>
                                <input
                                    id="email"
                                    className='flex h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300'
                                    type='email'
                                    required
                                    placeholder='Enter your email'
                                    onChange={(e) => setEmail(e.target.value)}
                                ></input>
                            </div>
                        </div>
                        <div>
                            <div className='flex items-center justify-between'>
                                <label
                                    htmlFor='password'
                                    className='text-base font-medium text-gray-900'
                                >
                                    Password
                                </label>
                                <Link
                                    to='/forgot-password'
                                    className='text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline'
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className='mt-2'>
                                <input
                                    id="password"
                                    className='flex h-12 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-base placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition duration-300'
                                    type='password'
                                    required
                                    placeholder='Enter your password'
                                    onChange={(e) => setPassword(e.target.value)}
                                ></input>
                            </div>
                        </div>

                        {/* Themed Submit Button */}
                        <div>
                            <button
                                type='submit'
                                disabled={loading}
                                className='inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-indigo-600 hover:to-cyan-500 text-white px-3.5 py-3 font-semibold leading-7 shadow-lg transition duration-300 transform hover:scale-[1.01] disabled:opacity-50'
                            >
                                {loading ? (
                                    <div className="w-6 h-6 rounded-full animate-spin border-4 border-solid border-white border-t-transparent shadow-md"></div>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className='ml-2' size={18} />
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

export default Signin;