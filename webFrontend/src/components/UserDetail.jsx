// UserDetail.jsx - Component to display individual user profile
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
    FaLinkedin, FaTwitter, FaFacebook, FaInstagram, 
    FaPhoneAlt, FaGraduationCap, FaBriefcase, FaUser,
    FaArrowLeft
} from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { MdEmail } from 'react-icons/md';
import { PiGenderMaleBold } from 'react-icons/pi';
import { SlCalender } from 'react-icons/sl';
import { GiBigDiamondRing } from 'react-icons/gi';

const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:3000/api/user/users/${id}`, {
                    withCredentials: true,
                });
                setUser(response.data.user);
                console.log('👤 User details:', response.data.user);
            } catch (err) {
                console.error('❌ Error fetching user:', err);
                setError('Failed to load user details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id]);

    const formatDate = (isoDate) => {
        if (!isoDate) return 'Not specified';
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen bg-gray-100'>
                <div className='text-center'>
                    <div className='w-12 h-12 rounded-full animate-spin border-4 border-solid border-indigo-500 border-t-transparent shadow-md mx-auto mb-4'></div>
                    <p className='text-gray-600'>Loading user profile...</p>
                </div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100'>
                <div className='text-center bg-white p-8 rounded-lg shadow-lg max-w-md'>
                    <p className='text-red-600 text-lg font-medium mb-4'>{error || 'User not found'}</p>
                    <Link
                        to="/alumnidirectory"
                        className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition inline-flex items-center'
                    >
                        <FaArrowLeft className='mr-2' />
                        Back to Directory
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full bg-gray-100 min-h-screen'>
            {/* Back Button */}
            <div className='container mx-auto px-6 py-4'>
                <Link
                    to="/alumnidirectory"
                    className='inline-flex items-center text-indigo-600 hover:text-indigo-800 transition'
                >
                    <FaArrowLeft className='mr-2' />
                    Back to Alumni Directory
                </Link>
            </div>

            <div className='container mx-auto px-6 py-8'>
                <div className='max-w-4xl mx-auto'>
                    <div className='flex flex-col md:flex-row gap-6'>
                        {/* Left Column - Profile Card */}
                        <div className='md:w-1/3'>
                            <div className='bg-white rounded-lg shadow-lg p-6'>
                                <div className='flex flex-col items-center'>
                                    <img
                                        src={
                                            user?.profile?.profilePicture 
                                                ? `http://localhost:3000${user.profile.profilePicture}`
                                                : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4F46E5&color=fff&size=128`
                                        }
                                        alt='Profile Picture'
                                        className='w-32 h-32 rounded-full mb-4 object-cover border-4 border-gray-200 shadow-lg'
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4F46E5&color=fff&size=128`;
                                        }}
                                    />
                                    <h1 className='text-2xl font-bold text-center mb-2'>{user?.name}</h1>
                                    <div className='text-center mb-4'>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                            user?.role === 'STUDENT' ? 'bg-blue-100 text-blue-800' :
                                            user?.role === 'ALUMNI' ? 'bg-green-100 text-green-800' :
                                            user?.role === 'FACULTY' ? 'bg-purple-100 text-purple-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user?.role}
                                        </span>
                                    </div>

                                    {/* Years */}
                                    <p className='text-gray-600 text-center mb-4'>
                                        {(user?.role === 'STUDENT' || user?.role === 'ALUMNI') && user?.student && 
                                            `${user.student.joiningYear} - ${user.student.passingYear} Batch`
                                        }
                                        {user?.role === 'FACULTY' && user?.faculty && 
                                            `${user.faculty.joiningYear} - ${user.faculty.leftYear}`
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className='bg-white rounded-lg shadow-lg p-6 mt-6'>
                                <h2 className='text-xl font-semibold mb-4'>Contact Information</h2>
                                <div className='space-y-3'>
                                    <p className='flex items-center text-gray-700'>
                                        <MdEmail className='mr-3 text-indigo-600' />
                                        <span className='break-all'>{user?.email}</span>
                                    </p>

                                    {user?.phoneVisibility === 'PUBLIC' && (
                                        <p className='flex items-center text-gray-700'>
                                            <FaPhoneAlt className='mr-3 text-indigo-600' />
                                            {user?.phone}
                                        </p>
                                    )}

                                    {user?.profile?.location && (
                                        <p className='flex items-center text-gray-700'>
                                            <FaLocationDot className='mr-3 text-indigo-600' />
                                            {user.profile.location}
                                        </p>
                                    )}

                                    {user?.profile?.dob && (
                                        <p className='flex items-center text-gray-700'>
                                            <SlCalender className='mr-3 text-indigo-600' />
                                            {formatDate(user.profile.dob)}
                                        </p>
                                    )}

                                    {user?.profile?.gender && user.profile.gender !== 'NOT_SPECIFIED' && (
                                        <p className='flex items-center text-gray-700'>
                                            <PiGenderMaleBold className='mr-3 text-indigo-600' />
                                            {user.profile.gender}
                                        </p>
                                    )}

                                    {user?.profile?.maritalStatus && user.profile.maritalStatus !== 'NOT_SPECIFIED' && (
                                        <p className='flex items-center text-gray-700'>
                                            <GiBigDiamondRing className='mr-3 text-indigo-600' />
                                            {user.profile.maritalStatus}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Social Media */}
                            {user?.socialMedia && (
                                <div className='bg-white rounded-lg shadow-lg p-6 mt-6'>
                                    <h2 className='text-xl font-semibold mb-4'>Connect</h2>
                                    <div className='flex space-x-4'>
                                        {user.socialMedia.linkedin && (
                                            <a
                                                href={`https://linkedin.com/in/${user.socialMedia.linkedin}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='text-blue-600 hover:text-blue-800 transition-colors'
                                            >
                                                <FaLinkedin size={24} />
                                            </a>
                                        )}
                                        {user.socialMedia.twitter && (
                                            <a
                                                href={`https://x.com/${user.socialMedia.twitter}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='text-blue-400 hover:text-blue-600 transition-colors'
                                            >
                                                <FaTwitter size={24} />
                                            </a>
                                        )}
                                        {user.socialMedia.facebook && (
                                            <a
                                                href={`https://facebook.com/${user.socialMedia.facebook}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='text-blue-700 hover:text-blue-900 transition-colors'
                                            >
                                                <FaFacebook size={24} />
                                            </a>
                                        )}
                                        {user.socialMedia.instagram && (
                                            <a
                                                href={`https://instagram.com/${user.socialMedia.instagram}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='text-pink-600 hover:text-pink-800 transition-colors'
                                            >
                                                <FaInstagram size={24} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Details */}
                        <div className='md:w-2/3 space-y-6'>
                            {/* About */}
                            {user?.profile?.about && (
                                <div className='bg-white rounded-lg shadow-lg p-6'>
                                    <h2 className='text-xl font-semibold mb-4'>About</h2>
                                    <p className='text-gray-700 whitespace-pre-wrap'>{user.profile.about}</p>
                                </div>
                            )}

                            {/* Education */}
                            <div className='bg-white rounded-lg shadow-lg p-6'>
                                <h2 className='text-xl font-semibold mb-4'>Education</h2>

                                {/* Current Institution */}
                                {(user?.role === 'STUDENT' || user?.role === 'ALUMNI') && user?.student && (
                                    <div className='bg-indigo-50 rounded-lg p-4 mb-4'>
                                        <h3 className='font-semibold text-indigo-800'>Current/Last Institution</h3>
                                        <p className='text-indigo-700'>{user.student.course}</p>
                                        <p className='text-indigo-600'>{user.student.branch}</p>
                                        <p className='text-indigo-500'>{user.student.joiningYear} - {user.student.passingYear}</p>
                                        <p className='text-indigo-500'>Roll No: {user.student.rollNo}</p>
                                    </div>
                                )}

                                {/* Other Education */}
                                {user?.education?.map((edu) => (
                                    <div key={edu.id} className='bg-gray-50 rounded-lg p-4 mb-4'>
                                        <h3 className='font-semibold'>{edu.institute}</h3>
                                        <p className='text-gray-600'>{edu.degree}</p>
                                        <p className='text-gray-600'>{edu.branch}</p>
                                        <p className='text-gray-500'>{edu.joiningYear} - {edu.passingYear}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Work Experience */}
                            <div className='bg-white rounded-lg shadow-lg p-6'>
                                <h2 className='text-xl font-semibold mb-4'>Work Experience</h2>

                                {/* Faculty Position */}
                                {user?.role === 'FACULTY' && user?.faculty && (
                                    <div className='bg-purple-50 rounded-lg p-4 mb-4'>
                                        <h3 className='font-semibold text-purple-800'>{user.faculty.jobTitle}</h3>
                                        <p className='text-purple-700'>{user.faculty.department}</p>
                                        <p className='text-purple-600'>{user.faculty.joiningYear} - {user.faculty.leftYear}</p>
                                    </div>
                                )}

                                {/* Other Work Experience */}
                                {user?.workExperience?.map((exp) => (
                                    <div key={exp.id} className='bg-gray-50 rounded-lg p-4 mb-4'>
                                        <h3 className='font-semibold'>{exp.jobTitle}</h3>
                                        <p className='text-gray-600'>{exp.company}</p>
                                        <p className='text-gray-500'>{exp.joiningYear} - {exp.leftYear}</p>
                                    </div>
                                ))}

                                {(!user?.workExperience || user.workExperience.length === 0) && user?.role !== 'FACULTY' && (
                                    <p className='text-gray-500'>No work experience added yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;