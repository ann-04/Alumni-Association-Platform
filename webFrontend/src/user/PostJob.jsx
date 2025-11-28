// src/user/PostJob.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBriefcase, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';

const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company: '',
        location: '',
        type: 'FULL_TIME',
        salaryMin: '',
        salaryMax: '',
        requirements: '',
        applicationLink: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                'http://localhost:3000/api/jobs', // Updated to match your route structure
                {
                    ...formData,
                    salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
                    salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null
                },
                {
                    withCredentials: true // Using cookies like your other auth calls
                }
            );

            alert('Job posted successfully!');
            navigate('/jobs');
        } catch (err) {
            console.error('Error posting job:', err);
            setError(
                err.response?.data?.error || 
                'Failed to post job. Please try again later.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 min-h-[60vh]">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/jobs')}
                    className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition"
                >
                    <FaArrowLeft className="mr-2" />
                    Back to Job Board
                </button>
                <h1 className="text-4xl font-extrabold text-indigo-800 flex items-center">
                    <FaBriefcase className="mr-3 text-cyan-600" />
                    Post a New Job
                </h1>
                <p className="text-gray-600 mt-2">
                    Share job opportunities with the alumni community
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Job Title */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Senior React Developer"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Company */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Company *
                        </label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            required
                            placeholder="e.g., TechCorp Inc."
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Location *
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            placeholder="e.g., Bengaluru, Mumbai, Remote"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Job Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Type
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="FULL_TIME">Full Time</option>
                            <option value="PART_TIME">Part Time</option>
                            <option value="CONTRACT">Contract</option>
                            <option value="INTERNSHIP">Internship</option>
                            <option value="REMOTE">Remote</option>
                            <option value="HYBRID">Hybrid</option>
                        </select>
                    </div>

                    {/* Application Link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Application Link
                            <FaExternalLinkAlt className="inline ml-1 text-xs" />
                        </label>
                        <input
                            type="url"
                            name="applicationLink"
                            value={formData.applicationLink}
                            onChange={handleChange}
                            placeholder="https://company.com/careers or naukri.com link"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Link to company careers page, Naukri, LinkedIn, etc.
                        </p>
                    </div>

                    {/* Salary Range */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Salary (₹ per annum)
                        </label>
                        <input
                            type="number"
                            name="salaryMin"
                            value={formData.salaryMin}
                            onChange={handleChange}
                            placeholder="e.g., 500000"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Maximum Salary (₹ per annum)
                        </label>
                        <input
                            type="number"
                            name="salaryMax"
                            value={formData.salaryMax}
                            onChange={handleChange}
                            placeholder="e.g., 1200000"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Job Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Job Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="6"
                            placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Requirements */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Requirements & Qualifications
                        </label>
                        <textarea
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                            rows="4"
                            placeholder="List the required skills, experience, qualifications, etc..."
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Posting Job...
                            </div>
                        ) : (
                            'Post Job'
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/jobs')}
                        className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostJob;