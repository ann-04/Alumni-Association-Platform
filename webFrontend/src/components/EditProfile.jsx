// src/components/EditProfile.jsx - Updated with profile picture functionality
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, X, Camera } from 'lucide-react';
import { useStore } from '../store';
import { API } from '../../config';

const EditProfile = ({ setEditProfileOpen }) => {
    const { user, updateUser } = useStore();
    const [profile, setProfile] = useState(user || {});
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setProfile(user || {});
        // Set existing profile picture preview
        if (user?.profile?.profilePicture) {
            setProfilePicturePreview(`http://localhost:3000${user.profile.profilePicture}`);
        }
    }, [user]);

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

    // Remove profile picture
    const removeProfilePicture = async () => {
        try {
            await axios.delete('http://localhost:3000/api/user/profile/picture', {
                withCredentials: true
            });

            setProfilePicture(null);
            setProfilePicturePreview(null);

            // Reset file input
            const fileInput = document.getElementById('profilePictureEdit');
            if (fileInput) fileInput.value = '';

            console.log('✅ Profile picture deleted');
        } catch (error) {
            console.error('❌ Error deleting profile picture:', error);
            alert('Failed to delete profile picture');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        try {
            setLoading(true);
            setErrorMessage('');

            // Update basic profile info
            const response = await axios.put(
                'http://localhost:3000/api/user/signup',
                {
                    name: profile?.name,
                    email: profile?.email,
                    phone: profile?.phone,
                    phoneVisibility: profile?.phoneVisibility,
                    role: profile?.role,
                },
                { withCredentials: true }
            );

            // Upload new profile picture if selected
            if (profilePicture) {
                const formData = new FormData();
                formData.append('profilePicture', profilePicture);

                const pictureResponse = await axios.post(
                    'http://localhost:3000/api/user/profile/picture',
                    formData,
                    { 
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        }
                    }
                );

                console.log('✅ Profile picture uploaded:', pictureResponse.data.profilePicture);
            }

            console.log('Profile updated successfully!', response?.data);

            // Update user store
            updateUser({ 
                ...user, 
                name: response?.data?.name, 
                email: response?.data?.email, 
                phone: response?.data?.phone, 
                phoneVisibility: response?.data?.phoneVisibility, 
                role: response?.data?.role 
            });

            setEditProfileOpen(false);

            // Refresh page to show new profile picture
            if (profilePicture) {
                window.location.reload();
            }

        } catch (error) {
            console.error('Error while updating profile!', error);
            setErrorMessage(error.response?.data?.error || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='relative z-10'>
                <div className='fixed z-10 inset-0 overflow-y-auto backdrop-blur-md'>
                    <div className='flex items-end md:items-center justify-center min-h-full p-4 text-center md:p-0'>
                        <div className='relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all md:my-8 md:max-w-lg w-screen max-h-[90vh] overflow-y-auto'>
                            <div className='bg-white p-4 md:p-6 md:pb-4'>
                                <div className='md:flex md:items-start'>
                                    <div className='w-full mt-3 text-center md:mt-0 md:text-left'>
                                        <h3
                                            className='text-lg leading-6 font-medium text-gray-900 mb-4'
                                            id='modal-title'
                                        >
                                            Edit Profile
                                        </h3>

                                        {/* Profile Picture Section */}
                                        <div className='mb-6'>
                                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                                Profile Picture
                                            </label>

                                            <div className='flex flex-col items-center space-y-3'>
                                                {/* Current/Preview Picture */}
                                                <div className='relative'>
                                                    {profilePicturePreview ? (
                                                        <div className='relative'>
                                                            <img
                                                                src={profilePicturePreview}
                                                                alt='Profile'
                                                                className='w-24 h-24 rounded-full object-cover border-2 border-gray-200'
                                                            />
                                                            <button
                                                                type='button'
                                                                onClick={removeProfilePicture}
                                                                className='absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
                                                                title='Remove picture'
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className='w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300'>
                                                            <Camera className='text-gray-400' size={20} />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Upload Button */}
                                                <div>
                                                    <input
                                                        type='file'
                                                        id='profilePictureEdit'
                                                        accept='image/*'
                                                        onChange={handleFileChange}
                                                        className='hidden'
                                                    />
                                                    <label
                                                        htmlFor='profilePictureEdit'
                                                        className='cursor-pointer bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition'
                                                    >
                                                        {profilePicturePreview ? 'Change' : 'Upload'}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {errorMessage && (
                                            <div className='mb-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm'>
                                                {errorMessage}
                                            </div>
                                        )}

                                        {/* Basic Profile Fields */}
                                        <div className='mt-2 text-start space-y-1 mb-4'>
                                            <label htmlFor='name'>Name</label>
                                            <input
                                                type='text'
                                                className='w-full border rounded-lg p-2'
                                                placeholder='Full Name'
                                                value={profile?.name || ''}
                                                onChange={(e) =>
                                                    setProfile({
                                                        ...profile,
                                                        name: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className='mt-2 text-start space-y-1 mb-4'>
                                            <label htmlFor='email'>Email</label>
                                            <input
                                                type='email'
                                                className='w-full border rounded-lg p-2'
                                                placeholder='Email Address'
                                                value={profile?.email || ''}
                                                onChange={(e) =>
                                                    setProfile({
                                                        ...profile,
                                                        email: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className='mt-2 text-start space-y-1 mb-4'>
                                            <label htmlFor='phone'>Phone Number</label>
                                            <input
                                                type='tel'
                                                className='w-full border rounded-lg p-2'
                                                placeholder='Phone Number'
                                                value={profile?.phone || ''}
                                                onChange={(e) =>
                                                    setProfile({
                                                        ...profile,
                                                        phone: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className='mt-2 text-start space-y-1 mb-4'>
                                            <label>Phone Number Visibility</label>
                                            <div className='mt-2 space-y-2'>
                                                <div className='flex items-center'>
                                                    <input
                                                        className='mr-2'
                                                        type='radio'
                                                        name='phoneVisibility'
                                                        value='PUBLIC'
                                                        id='public'
                                                        checked={profile?.phoneVisibility === 'PUBLIC'}
                                                        onChange={(e) => setProfile({ ...profile, phoneVisibility: e.target.value })}
                                                    />
                                                    <label htmlFor="public" className='text-sm'>Public</label>
                                                </div>
                                                <div className='flex items-center'>
                                                    <input
                                                        className='mr-2'
                                                        type='radio'
                                                        name='phoneVisibility'
                                                        id='private'
                                                        value='PRIVATE'
                                                        checked={profile?.phoneVisibility === 'PRIVATE'}
                                                        onChange={(e) => setProfile({ ...profile, phoneVisibility: e.target.value })}
                                                    />
                                                    <label htmlFor="private" className='text-sm'>Private</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='mt-2 text-start space-y-1 mb-4'>
                                            <label htmlFor='role'>Role</label>
                                            <select
                                                className='w-full border rounded-lg p-2 bg-gray-100'
                                                disabled
                                                value={profile?.role || 'Select'}
                                            >
                                                <option value='Select' disabled>Select</option>
                                                <option value='STUDENT'>Student</option>
                                                <option value='ALUMNI'>Alumni</option>
                                                <option value='FACULTY'>Faculty</option>
                                            </select>
                                            <p className='text-xs text-gray-500'>Role cannot be changed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='bg-gray-50 px-4 py-3 md:px-6 md:flex md:flex-row-reverse'>
                                <button
                                    type='button'
                                    className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 md:ml-3 md:w-auto md:text-sm'
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className='w-4 h-4 rounded-full animate-spin border-4 border-solid border-blue-500 border-t-transparent shadow-md'></div>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>

                                <button
                                    type='button'
                                    className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 md:mt-0 md:ml-3 md:w-auto md:text-sm'
                                    onClick={() => setEditProfileOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProfile;