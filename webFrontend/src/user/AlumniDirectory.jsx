// AlumniDirectory.jsx - Updated with profile picture functionality
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../store';
import { API } from '../../config';

const AlumniDirectory = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API}/user/users`, {
                    withCredentials: true,
                });
                setUsers(response?.data?.users);
                setLoading(false);
                console.log('Users: ', response?.data?.users);
            } catch (err) {
                setError('Failed to load users.');
                setLoading(false);
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    // Profile image component with fallback
    const ProfileImage = ({ user }) => {
        const [imageError, setImageError] = useState(false);
        const profilePicture = user?.profile?.profilePicture;
        const userName = user?.name || 'User';

        const handleImageError = () => {
            setImageError(true);
        };

        if (profilePicture && !imageError) {
            return (
                <img
                    alt={`${userName}'s profile`}
                    className='block w-full h-[300px] object-cover'
                    src={
    user?.profile?.profilePicture 
        ? `http://localhost:3000${user.profile.profilePicture}`
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=a7c7e7&color=fff&size=300&bold=true&font-size=0.5`
}
                    onError={handleImageError}
                />
            );
        }

        // Fallback to letter avatar
        return (
            <div className="w-full h-[300px] flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500">
                <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-4xl font-bold text-white">
                            {userName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <p className="text-white/80 text-sm">No photo uploaded</p>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className='container my-12 mx-auto px-4 md:px-12'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800 text-center mb-2'>Alumni Directory</h1>
                    <p className='text-gray-600 text-center'>Connect with fellow alumni and faculty members</p>
                </div>

                <div className='flex flex-wrap -mx-1 lg:-mx-4'>
                    {loading ? (
                        <div className='flex items-center justify-center min-h-[70vh] mx-auto'>
                            <div className='relative'>
                                <div className='w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200 border-t-cyan-400'></div>
                                <div className='w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-indigo-500 border-t-transparent shadow-md'></div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className='text-center w-full'>
                            <div className='bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto'>
                                <div className='text-red-500 text-5xl mb-4'>⚠️</div>
                                <p className='text-xl text-red-600 font-semibold mb-2'>Oops! Something went wrong</p>
                                <p className='text-red-500'>{error}</p>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className='mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : users?.length === 0 ? (
                        <div className='text-center w-full'>
                            <div className='bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto'>
                                <div className='text-gray-400 text-5xl mb-4'>👥</div>
                                <p className='text-xl text-gray-600 font-semibold mb-2'>No Users Found</p>
                                <p className='text-gray-500'>The directory is empty. Please check back later!</p>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-wrap -mx-1 lg:-mx-4 w-full'>
                            {users?.map((user) => (
                                <div
                                    className='my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3 flex items-center justify-center'
                                    key={user?.id}
                                >
                                    <Link to={`/userDetail/${user?.id}`} className='block w-full max-w-sm group'>
                                        <div className='flex flex-col overflow-hidden rounded-xl shadow-lg bg-white border border-gray-200 transition duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-indigo-300'>
                                            {/* Profile Image Section */}
                                            <div className="relative overflow-hidden">
                                                <ProfileImage user={user} />

                                                {/* Online Status Indicator (if you want to add this) */}
                                                <div className="absolute top-4 right-4">
                                                    <div className="w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
                                                </div>
                                            </div>

                                            {/* User Info Section */}
                                            <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 group-hover:from-indigo-100 group-hover:to-purple-100 transition duration-300">
                                                <div className='flex flex-col space-y-3'>
                                                    <h1 className='text-xl font-bold text-gray-800 group-hover:text-indigo-700 transition duration-150'>
                                                        {user?.name}
                                                    </h1>

                                                    <div className='flex flex-col space-y-1'>
                                                        <p className='text-indigo-600 group-hover:text-indigo-700 font-medium text-sm'>
                                                            {user && (user?.role === 'STUDENT' || user?.role === 'ALUMNI') && (
                                                                <>
                                                                    <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                                                                        {user?.role}
                                                                    </span>
                                                                    {user?.student?.joiningYear} - {user?.student?.passingYear}
                                                                </>
                                                            )}
                                                            {user && user?.role === 'FACULTY' && (
                                                                <>
                                                                    <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium mr-2">
                                                                        {user?.role}
                                                                    </span>
                                                                    {user?.faculty?.joiningYear} - {user?.faculty?.leftYear}
                                                                </>
                                                            )}
                                                        </p>

                                                        <p className='text-gray-600 group-hover:text-gray-700 text-sm font-medium'>
                                                            {user?.student && user?.student?.branch && (
                                                                <span className="flex items-center">
                                                                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                                                                    {user.student.branch.replace(/_/g, ' ').toLowerCase().replace(/\w/g, l => l.toUpperCase())}
                                                                </span>
                                                            )}
                                                            {user?.faculty && user?.faculty?.department && (
                                                                <span className="flex items-center">
                                                                    <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                                                                    {user.faculty.department.replace(/_/g, ' ').toLowerCase().replace(/\w/g, l => l.toUpperCase())}
                                                                </span>
                                                            )}
                                                        </p>

                                                        {/* Location if available */}
                                                        {user?.profile?.location && (
                                                            <p className='text-gray-500 text-xs flex items-center'>
                                                                <span className="mr-1">📍</span>
                                                                {user.profile.location}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* View Profile Button */}
                                                <div className="mt-4 pt-3 border-t border-indigo-100">
                                                    <span className="inline-flex items-center text-indigo-600 group-hover:text-indigo-700 text-sm font-medium">
                                                        View Profile 
                                                        <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AlumniDirectory;