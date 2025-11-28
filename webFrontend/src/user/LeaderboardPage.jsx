// src/user/LeaderboardPage.jsx - Updated to exclude cancelled events from counts
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { FaTrophy, FaMedal, FaAward, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        'http://localhost:3000/api/events/leaderboard',
        { withCredentials: true }
      );

      // Process the data to exclude cancelled events from totals
      const processedData = (response.data.leaderboard || []).map(user => {
        // Recalculate totals to only count approved events
        const totalEvents = user.approvedEvents; // Only count approved events
        const averagePerYear = totalEvents / user.yearsActive;

        return {
          ...user,
          totalEvents, // This now only includes approved events
          averagePerYear: Math.round(averagePerYear * 100) / 100
        };
      })
      .filter(user => user.totalEvents > 0) // Only show users with approved events
      .sort((a, b) => b.totalEvents - a.totalEvents); // Sort by total approved events

      setLeaderboardData(processedData);
      console.log('✅ Leaderboard fetched:', processedData.length, 'contributors');
    } catch (err) {
      console.error('❌ Error fetching leaderboard:', err);
      setError('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Calculate statistics - simplified for auto-approval
  const stats = leaderboardData.length > 0 ? {
    totalEvents: leaderboardData.reduce((acc, a) => acc + a.totalEvents, 0),
    totalCancelled: leaderboardData.reduce((acc, a) => acc + a.cancelledEvents, 0),
    avgEventsPerPerson: (leaderboardData.reduce((acc, a) => acc + a.totalEvents, 0) / leaderboardData.length).toFixed(1),
    mostActive: leaderboardData[0],
    mostConsistent: leaderboardData.slice().sort((a, b) => b.averagePerYear - a.averagePerYear)[0]
  } : null;

  // Colors for charts
  const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316'];

  // Card Component - simplified for auto-approval
  const AlumniCard = ({ alumni, rank }) => {
    const getRankIcon = (rank) => {
      switch(rank) {
        case 1: return <FaTrophy className="text-yellow-500 text-xl" />;
        case 2: return <FaMedal className="text-gray-400 text-xl" />;
        case 3: return <FaAward className="text-amber-600 text-xl" />;
        default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
      }
    };

    const getRankBadge = (rank) => {
      if (rank <= 3) {
        const colors = ['bg-yellow-100 border-yellow-300', 'bg-gray-100 border-gray-300', 'bg-amber-100 border-amber-300'];
        return colors[rank - 1];
      }
      return 'bg-blue-50 border-blue-200';
    };

    return (
      <div className={`p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-2 ${getRankBadge(rank)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getRankIcon(rank)}
            <div>
              <h3 className="text-lg font-bold text-gray-800">{alumni.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{alumni.role.toLowerCase()}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600">{alumni.totalEvents}</div>
            <div className="text-xs text-gray-500">Events Organized</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center text-sm">
          <div>
            <div className="font-semibold text-green-600">{alumni.approvedEvents}</div>
            <div className="text-gray-500">Active Events</div>
          </div>
          <div>
            <div className="font-semibold text-purple-600">{alumni.averagePerYear}</div>
            <div className="text-gray-500">Avg/Year</div>
          </div>
        </div>

        {alumni.cancelledEvents > 0 && (
          <div className="mt-4 bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Event Status</div>
            <div className="flex space-x-1">
              <div 
                className="bg-green-500 h-2 rounded"
                style={{ width: `${(alumni.approvedEvents / Math.max(alumni.totalEvents + alumni.cancelledEvents, 1)) * 100}%` }}
                title={`${alumni.approvedEvents} active`}
              ></div>
              <div 
                className="bg-red-500 h-2 rounded"
                style={{ width: `${(alumni.cancelledEvents / Math.max(alumni.totalEvents + alumni.cancelledEvents, 1)) * 100}%` }}
                title={`${alumni.cancelledEvents} cancelled`}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {alumni.cancelledEvents} cancelled events
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-10 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-indigo-600 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-10 min-h-[60vh] flex items-center justify-center">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8">
          <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!leaderboardData.length) {
    return (
      <div className="container mx-auto px-6 py-10 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <FaTrophy className="text-gray-300 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Event Organizers Yet</h2>
          <p className="text-gray-500">
            Be the first to organize an event and claim the top spot on the leaderboard!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-800 mb-2 flex items-center justify-center">
          <FaTrophy className="mr-3 text-yellow-500" />
          Event Organization Leaderboard
        </h1>
        <p className="text-gray-600">
          Celebrating our most active event organizers and community builders
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT SIDE - Charts + Summary */}
        <div className="space-y-6">
          {/* Statistics Cards - simplified */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalEvents}</div>
              <div className="text-sm text-gray-600">Total Events Organized</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-3xl font-bold text-green-600">{leaderboardData.length}</div>
              <div className="text-sm text-gray-600">Active Organizers</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.avgEventsPerPerson}</div>
              <div className="text-sm text-gray-600">Avg Events Per Person</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.totalCancelled}</div>
              <div className="text-sm text-gray-600">Cancelled Events</div>
            </div>
          </div>

          {/* Bar Chart - simplified */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Event Organization Statistics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leaderboardData.slice(0, 8)} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalEvents" fill="#3b82f6" name="Total Events" />
                <Bar dataKey="averagePerYear" fill="#8b5cf6" name="Avg Per Year" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Role Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Organizers by Role</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={Object.entries(
                    leaderboardData.reduce((acc, person) => {
                      acc[person.role] = (acc[person.role] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([role, count]) => ({ name: role, value: count }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(
                    leaderboardData.reduce((acc, person) => {
                      acc[person.role] = (acc[person.role] || 0) + 1;
                      return acc;
                    }, {})
                  ).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT SIDE - Leaderboard Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Contributors</h2>
          <div className="space-y-4 max-h-[800px] overflow-y-auto">
            {leaderboardData.map((alumni, index) => (
              <AlumniCard key={alumni.id} alumni={alumni} rank={index + 1} />
            ))}
          </div>
        </div>
      </div>

      {/* Fun Facts Section - updated */}
      {stats && (
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-indigo-800 mb-6 text-center">🎉 Leaderboard Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <h4 className="font-bold text-lg text-gray-800">Most Active Organizer</h4>
              <p className="text-indigo-600 font-semibold">{stats.mostActive.name}</p>
              <p className="text-sm text-gray-600">{stats.mostActive.totalEvents} events organized</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">⭐</div>
              <h4 className="font-bold text-lg text-gray-800">Most Consistent</h4>
              <p className="text-indigo-600 font-semibold">{stats.mostConsistent.name}</p>
              <p className="text-sm text-gray-600">{stats.mostConsistent.averagePerYear} events per year average</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
