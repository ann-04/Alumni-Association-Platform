// src/user/JobDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    FaBriefcase, 
    FaArrowLeft, 
    FaMapMarkerAlt, 
    FaClock, 
    FaExternalLinkAlt,
    FaRupeeSign,
    FaUser,
    FaBuilding,
    FaCalendarAlt
} from 'react-icons/fa';
import axios from 'axios';

const JobDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:3000/api/jobs/${id}`, // Updated to match your route structure
                { withCredentials: true }
            );
            setJob(response.data.job);
            setError(null);
        } catch (err) {
            console.error('Error fetching job:', err);
            if (err.response?.status === 404) {
                setError('Job not found or may have been removed.');
            } else {
                setError('Failed to load job details. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatJobType = (type) => {
        return type.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const postDate = new Date(dateString);
        const diffTime = Math.abs(now - postDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
        return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Salary not disclosed';
        if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()} per annum`;
        if (min) return `₹${min.toLocaleString()}+ per annum`;
        if (max) return `Up to ₹${max.toLocaleString()} per annum`;
    };

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-12 min-h-[60vh]">
                <div className="text-center py-20 text-xl text-indigo-600">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    Loading Job Details...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-12 min-h-[60vh]">
                <div className="text-center py-20">
                    <div className="text-red-500 text-xl mb-4">{error}</div>
                    <button 
                        onClick={() => navigate('/jobs')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg mr-4"
                    >
                        Back to Jobs
                    </button>
                    <button 
                        onClick={fetchJob}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12 min-h-[60vh]">
            {/* Back Button */}
            <button
                onClick={() => navigate('/jobs')}
                className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition"
            >
                <FaArrowLeft className="mr-2" />
                Back to Job Board
            </button>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="mb-4 md:mb-0">
                            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                            <div className="flex items-center text-indigo-100 mb-2">
                                <FaBuilding className="mr-2" />
                                <span className="text-xl">{job.company}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-indigo-100">
                                <div className="flex items-center">
                                    <FaMapMarkerAlt className="mr-2" />
                                    {job.location}
                                </div>
                                <div className="flex items-center">
                                    <FaClock className="mr-2" />
                                    {formatJobType(job.type)}
                                </div>
                                <div className="flex items-center">
                                    <FaCalendarAlt className="mr-2" />
                                    Posted {getTimeAgo(job.createdAt)}
                                </div>
                            </div>
                        </div>

                        {/* Apply Button */}
                        <div className="flex flex-col items-end">
                            {job.applicationLink ? (
                                <a
                                    href={job.applicationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold py-3 px-6 rounded-lg shadow-lg transition flex items-center"
                                >
                                    Apply Now
                                    <FaExternalLinkAlt className="ml-2" />
                                </a>
                            ) : (
                                <div className="bg-gray-300 text-gray-600 font-semibold py-3 px-6 rounded-lg">
                                    Contact for Application
                                </div>
                            )}
                            <p className="text-indigo-100 text-sm mt-2">
                                Posted by {job.postedBy.name}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Job Details */}
                <div className="p-8">
                    {/* Salary Information */}
                    {(job.salaryMin || job.salaryMax) && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center text-green-800">
                                <FaRupeeSign className="mr-2" />
                                <span className="font-semibold text-lg">
                                    {formatSalary(job.salaryMin, job.salaryMax)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Job Description */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Description</h2>
                        <div className="prose max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {job.description}
                            </p>
                        </div>
                    </div>

                    {/* Requirements */}
                    {job.requirements && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Requirements & Qualifications
                            </h2>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {job.requirements}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Contact Information */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center text-gray-700 mb-2">
                                <FaUser className="mr-3 text-gray-500" />
                                <span>Posted by: <strong>{job.postedBy.name}</strong></span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <span className="mr-3 text-gray-500">✉</span>
                                <span>Contact: <strong>{job.postedBy.email}</strong></span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
                        {job.applicationLink ? (
                            <a
                                href={job.applicationLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition flex items-center justify-center"
                            >
                                Apply on External Site
                                <FaExternalLinkAlt className="ml-2" />
                            </a>
                        ) : (
                            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition">
                                Contact Employer
                            </button>
                        )}

                        <Link
                            to="/jobs"
                            className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg text-center transition"
                        >
                            Back to Jobs
                        </Link>
                    </div>
                </div>
            </div>

            {/* Similar Jobs or Related Actions */}
            <div className="mt-8 text-center">
                <Link
                    to="/jobs"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    <FaBriefcase className="mr-2" />
                    View More Job Opportunities
                </Link>
            </div>
        </div>
    );
};

export default JobDetail;