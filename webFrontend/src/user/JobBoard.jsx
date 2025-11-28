// src/user/JobBoard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaPlusCircle, FaMapMarkerAlt, FaClock, FaFilter } from 'react-icons/fa';
import axios from 'axios';

const JobBoard = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        type: '',
        location: '',
        company: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchJobs = async (page = 1) => {
        try {
            setLoading(true);
            setError(null); // Clear any previous errors

            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: '9',
                ...(filters.type && { type: filters.type }),
                ...(filters.location && { location: filters.location }),
                ...(filters.company && { company: filters.company })
            });

            const response = await axios.get(
                `http://localhost:3000/api/jobs?${queryParams}`,
                { withCredentials: true }
            );

            // Handle successful response with jobs array (even if empty)
            const jobsData = response.data.jobs || [];
            setJobs(jobsData);
            setTotalPages(response.data.pagination?.pages || 1);
            setCurrentPage(page);

        } catch (err) {
            console.error('Error fetching jobs:', err);

            // Check if it's a 404 or empty result vs actual error
            if (err.response?.status === 404 || err.response?.data?.jobs === null) {
                // Treat as no jobs found
                setJobs([]);
                setTotalPages(1);
                setCurrentPage(1);
            } else {
                // Actual error - show error message
                setError('Failed to load jobs. Please check your connection and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(1);
    }, [filters]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            type: '',
            location: '',
            company: ''
        });
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

    const formatJobType = (type) => {
        return type.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
    };

    return (
        <div className="container mx-auto px-6 py-12 min-h-[60vh]">
            {/* Header - Always visible */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4">
                <h1 className="text-4xl font-extrabold text-indigo-800 flex items-center mb-4 md:mb-0">
                    <FaBriefcase className="mr-3 text-cyan-600" />
                    Alumni Job Board
                </h1>
                <Link 
                    to="/postjob" 
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition shadow-md"
                >
                    <FaPlusCircle className="mr-2" />
                    Post a Job
                </Link>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-20 text-xl text-indigo-600">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    Loading Jobs...
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="text-center py-20">
                    <div className="text-red-500 text-xl mb-4">{error}</div>
                    <button 
                        onClick={() => fetchJobs(currentPage)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg mr-4"
                    >
                        Try Again
                    </button>
                    <Link 
                        to="/postjob" 
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                    >
                        Post a Job
                    </Link>
                </div>
            )}

            {/* Success State - Show filters and content */}
            {!loading && !error && (
                <>
                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="flex items-center mb-4">
                            <FaFilter className="text-indigo-600 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-800">Filter Jobs</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                                <select
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">All Types</option>
                                    <option value="FULL_TIME">Full Time</option>
                                    <option value="PART_TIME">Part Time</option>
                                    <option value="CONTRACT">Contract</option>
                                    <option value="INTERNSHIP">Internship</option>
                                    <option value="REMOTE">Remote</option>
                                    <option value="HYBRID">Hybrid</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    placeholder="Enter location"
                                    value={filters.location}
                                    onChange={(e) => handleFilterChange('location', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                                <input
                                    type="text"
                                    placeholder="Enter company"
                                    value={filters.company}
                                    onChange={(e) => handleFilterChange('company', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={clearFilters}
                                    className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Jobs Grid or No Jobs Message */}
                    {jobs.length > 0 ? (
                        <>
                            {/* Jobs Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {jobs.map(job => (
                                    <div key={job.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-t-4 border-cyan-500 flex flex-col justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h2>
                                            <p className="text-indigo-600 font-medium mb-3">{job.company}</p>
                                            <div className="text-sm text-gray-500 space-y-2">
                                                <p className="flex items-center">
                                                    <FaMapMarkerAlt className="mr-2 text-gray-400" /> 
                                                    {job.location}
                                                </p>
                                                <p className="flex items-center">
                                                    <FaClock className="mr-2 text-gray-400" /> 
                                                    {formatJobType(job.type)} • Posted {getTimeAgo(job.createdAt)}
                                                </p>
                                                {(job.salaryMin || job.salaryMax) && (
                                                    <p className="text-green-600 font-semibold">
                                                        ₹{job.salaryMin ? job.salaryMin.toLocaleString() : ''}
                                                        {job.salaryMin && job.salaryMax ? ' - ' : ''}
                                                        {job.salaryMax ? job.salaryMax.toLocaleString() : ''}
                                                        {job.salaryMin || job.salaryMax ? ' per annum' : ''}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                                                {job.description.substring(0, 120)}...
                                            </p>
                                        </div>
                                        <Link 
                                            to={`/job/${job.id}`} 
                                            className="mt-4 block text-center bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold py-2 rounded-lg hover:bg-indigo-100 transition"
                                        >
                                            View Details →
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-12 space-x-2">
                                    <button
                                        onClick={() => fetchJobs(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => fetchJobs(i + 1)}
                                            className={`px-4 py-2 border rounded-lg ${
                                                currentPage === i + 1 
                                                    ? 'bg-indigo-600 text-white' 
                                                    : 'hover:bg-gray-50'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => fetchJobs(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        /* No Jobs Message */
                        <div className="text-center py-16">
                            <div className="max-w-md mx-auto">
                                <FaBriefcase className="text-8xl text-gray-300 mx-auto mb-6" />
                                <h3 className="text-2xl font-semibold text-gray-700 mb-4">No Jobs Found</h3>
                                <p className="text-gray-500 mb-6">
                                    {Object.values(filters).some(filter => filter) 
                                        ? 'No jobs match your current filters. Try adjusting your search criteria or be the first to post a job!'
                                        : 'No jobs have been posted yet. Be the first to share an opportunity with our alumni community!'
                                    }
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link 
                                        to="/postjob" 
                                        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md flex items-center justify-center"
                                    >
                                        <FaPlusCircle className="mr-2" />
                                        Post the First Job
                                    </Link>
                                    {Object.values(filters).some(filter => filter) && (
                                        <button
                                            onClick={clearFilters}
                                            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default JobBoard;