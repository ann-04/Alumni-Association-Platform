// src/components/AddProfile.jsx - Updated with profile picture upload
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Upload, X } from 'lucide-react';
import { useStore } from '../store';
import { API } from '../../config';

const AddProfile = () => {
    const { user } = useStore();
    const [gender, setGender] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [location, setLocation] = useState('');
    const [dob, setDob] = useState('');
    const [about, setAbout] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    if (!user) {
        navigate('/signin');
    } else if (user.profileExists) {
        navigate('/profile');
    }

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Only image files are allowed');
                return;
            }

            setProfilePicture(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePicturePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove selected picture
    const removeProfilePicture = () => {
        setProfilePicture(null);
        setProfilePicturePreview(null);
        // Reset file input
        const fileInput = document.getElementById('profilePicture');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        try {
            setLoading(true);

            // Prepare form data for file upload
            const formData = new FormData();

            // Add profile picture if selected
            if (profilePicture) {
                formData.append('profilePicture', profilePicture);
            }

            // Add other profile data
            formData.append('gender', gender);
            formData.append('maritalStatus', maritalStatus);
            formData.append('location', location);
            formData.append('about', about);

            // Format date
            if (dob) {
                const dateParts = dob.split('-');
                const formattedDob = new Date(
                    dateParts[0],
                    dateParts[1] - 1,
                    dateParts[2]
                ).toISOString();
                formData.append('dob', formattedDob);
            }

            const response = await axios.post(
                'http://localhost:3000/api/user/profile',
                formData,
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            console.log('✅ Profile created:', response.data);
            alert('Profile created successfully!');
            navigate('/profile');

        } catch (err) {
            console.error('❌ Error creating profile:', err);
            alert(err.response?.data?.error || 'Failed to create profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section>
                <div className='flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-24'>
                    <div className='xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md'>
                        <div className='mb-2 flex justify-center'>
                            <svg
                                width='50'
                                height='56'
                                viewBox='0 0 50 56'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M23.2732 0.2528C20.8078 1.18964 2.12023 12.2346 1.08477 13.3686C0 14.552 0 14.7493 0 27.7665C0 39.6496 0.0986153 41.1289 0.83823 42.0164C2.12023 43.5449 23.2239 55.4774 24.6538 55.5267C25.9358 55.576 46.1027 44.3832 48.2229 42.4602C49.3077 41.474 49.3077 41.3261 49.3077 27.8158C49.3077 14.3055 49.3077 14.1576 48.2229 13.1714C46.6451 11.7415 27.1192 0.450027 25.64 0.104874C24.9497 -0.0923538 23.9142 0.00625992 23.2732 0.2528ZM20.2161 21.8989C20.2161 22.4906 18.9835 23.8219 17.0111 25.3997C15.2361 26.7803 13.8061 27.9637 13.8061 28.0623C13.8061 28.1116 15.2361 29.0978 16.9618 30.2319C18.6876 31.3659 20.2655 32.6479 20.4134 33.0917C20.8078 34.0286 19.871 35.2119 18.8355 35.2119C17.8001 35.2119 9.0233 29.3936 8.67815 28.5061C8.333 27.6186 9.36846 26.5338 14.3485 22.885C17.6521 20.4196 18.4904 20.0252 19.2793 20.4196C19.7724 20.7155 20.2161 21.3565 20.2161 21.8989ZM25.6893 27.6679C23.4211 34.9161 23.0267 35.7543 22.1391 34.8668C21.7447 34.4723 22.1391 32.6479 23.6677 27.9637C26.2317 20.321 26.5275 19.6307 27.2671 20.3703C27.6123 20.7155 27.1685 22.7864 25.6893 27.6679ZM36.0932 23.2302C40.6788 26.2379 41.3198 27.0269 40.3337 28.1609C39.1503 29.5909 31.6555 35.2119 30.9159 35.2119C29.9298 35.2119 28.9436 33.8806 29.2394 33.0424C29.3874 32.6479 30.9652 31.218 32.7403 29.8867L35.9946 27.4706L32.5431 25.1532C30.6201 23.9205 29.0915 22.7371 29.0915 22.5892C29.0915 21.7509 30.2256 20.4196 30.9159 20.4196C31.3597 20.4196 33.6771 21.7016 36.0932 23.2302Z'
                                    fill='black'
                                />
                            </svg>
                        </div>
                        <h2 className='text-center text-2xl font-bold leading-tight text-black'>
                            Add your profile
                        </h2>

                        <form
                            onSubmit={handleSubmit}
                            className='mt-8'
                            encType="multipart/form-data"
                        >
                            <div className='space-y-5'>
                                {/* Profile Picture Upload */}
                                <div>
                                    <label className='text-base font-medium text-gray-900 block mb-2'>
                                        Profile Picture
                                    </label>

                                    <div className='flex flex-col items-center space-y-4'>
                                        {/* Preview Area */}
                                        <div className='relative'>
                                            {profilePicturePreview ? (
                                                <div className='relative'>
                                                    <img
                                                        src={profilePicturePreview}
                                                        alt='Profile Preview'
                                                        className='w-32 h-32 rounded-full object-cover border-4 border-gray-200'
                                                    />
                                                    <button
                                                        type='button'
                                                        onClick={removeProfilePicture}
                                                        className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className='w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-300'>
                                                    <Upload className='text-gray-400' size={32} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Upload Button */}
                                        <div className='flex items-center space-x-4'>
                                            <input
                                                type='file'
                                                id='profilePicture'
                                                accept='image/*'
                                                onChange={handleFileChange}
                                                className='hidden'
                                            />
                                            <label
                                                htmlFor='profilePicture'
                                                className='cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition'
                                            >
                                                {profilePicture ? 'Change Picture' : 'Upload Picture'}
                                            </label>
                                        </div>

                                        <p className='text-xs text-gray-500 text-center'>
                                            Optional • Max 5MB • JPG, PNG, GIF
                                        </p>
                                    </div>
                                </div>

                                {/* About Me */}
                                <div>
                                    <label
                                        htmlFor='about'
                                        className='text-base font-medium text-gray-900'
                                    >
                                        About Me
                                    </label>
                                    <div className='mt-2'>
                                        <textarea
                                            rows={8}
                                            className='flex w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                                            placeholder='Tell us about yourself...'
                                            id='about'
                                            value={about}
                                            onChange={(e) => setAbout(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label
                                        htmlFor='location'
                                        className='text-base font-medium text-gray-900'
                                    >
                                        Location
                                    </label>
                                    <div className='mt-2'>
                                        <input
                                            className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                                            type='text'
                                            placeholder='Your location'
                                            id='location'
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label
                                        htmlFor='dob'
                                        className='text-base font-medium text-gray-900'
                                    >
                                        Date of Birth
                                    </label>
                                    <div className='mt-2'>
                                        <input
                                            className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                                            type='date'
                                            id='dob'
                                            value={dob}
                                            required
                                            onChange={(e) => setDob(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className='text-base font-medium text-gray-900'>
                                        Gender
                                    </label>
                                    <div className='mt-2'>
                                        <select
                                            className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                            required
                                        >
                                            <option value='' disabled>
                                                Select Gender
                                            </option>
                                            <option value='MALE'>Male</option>
                                            <option value='FEMALE'>Female</option>
                                            <option value='NOT_SPECIFIED'>Not Specified</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Marital Status */}
                                <div>
                                    <label className='text-base font-medium text-gray-900'>
                                        Marital Status
                                    </label>
                                    <div className='mt-2'>
                                        <select
                                            className='flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50'
                                            value={maritalStatus}
                                            onChange={(e) => setMaritalStatus(e.target.value)}
                                            required
                                        >
                                            <option value='' disabled>
                                                Select Status
                                            </option>
                                            <option value='SINGLE'>Single</option>
                                            <option value='MARRIED'>Married</option>
                                            <option value='NOT_SPECIFIED'>Not Specified</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div>
                                    <button
                                        type='submit'
                                        disabled={loading}
                                        className='inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80 disabled:opacity-50'
                                    >
                                        {loading ? (
                                            <div className='w-7 h-7 rounded-full animate-spin border-4 border-solid border-blue-500 border-t-transparent shadow-md'></div>
                                        ) : (
                                            <>
                                                Create Profile{' '}
                                                <ArrowRight
                                                    className='ml-2'
                                                    size={16}
                                                />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AddProfile;