// src/user/NewsEvents.jsx - Updated for new API endpoints
import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { IoCalendarOutline, IoLocationOutline } from 'react-icons/io5';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewsEvents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [activeNewsIndex, setActiveNewsIndex] = useState(0);
  const [visibleEventsCount, setVisibleEventsCount] = useState(6);

  // Data states
  const [newsData, setNewsData] = useState([]);
  const [eventsData, setEventsData] = useState([]);

  // Loading states
  const [newsLoading, setNewsLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);

  // Error states
  const [newsError, setNewsError] = useState(null);
  const [eventsError, setEventsError] = useState(null);

  const newsRef = useRef(null);

  // Fetch news data
  const fetchNews = async () => {
    try {
      setNewsLoading(true);
      setNewsError(null);

      const response = await axios.get(
        `http://localhost:3000/api/events/news?limit=10`, // Updated API endpoint
        { withCredentials: true }
      );

      setNewsData(response.data.news || []);
      console.log('✅ News fetched:', response.data.news.length);
    } catch (err) {
      console.error('❌ Error fetching news:', err);
      setNewsError('Failed to load news');
      setNewsData([]);
    } finally {
      setNewsLoading(false);
    }
  };

  // Fetch events data
  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      setEventsError(null);

      const response = await axios.get(
        `http://localhost:3000/api/events?limit=20&upcoming=true`, // Updated API endpoint
        { withCredentials: true }
      );

      setEventsData(response.data.events || []);
      console.log('✅ Events fetched:', response.data.events.length);
    } catch (err) {
      console.error('❌ Error fetching events:', err);
      setEventsError('Failed to load events');
      setEventsData([]);
    } finally {
      setEventsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchNews();
    fetchEvents();
  }, []);

  // Filter data based on search
  const filteredNews = newsData.filter(news =>
    news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    news.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = eventsData.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // News carousel navigation
  const handlePrevNews = () => {
    setActiveNewsIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, filteredNews.length - 1) : prevIndex - 1
    );
  };

  const handleNextNews = () => {
    setActiveNewsIndex((prevIndex) =>
      prevIndex === Math.max(0, filteredNews.length - 1) ? 0 : prevIndex + 1
    );
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        handlePrevNews();
      } else if (event.key === 'ArrowRight') {
        handleNextNews();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredNews.length]);

  // Reset active news index when search changes
  useEffect(() => {
    setActiveNewsIndex(0);
  }, [searchTerm]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatEventType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="container mx-auto px-4 py-4"> 
      {/* Search Bar */}
      <div className="my-2 w-full">
        <div className="relative">
          <input
            type="text"
            placeholder="Search news and events..."
            className="w-full p-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-400 text-xl" />
        </div>
      </div>

      <div className="lg:flex lg:space-x-8">
        {/* News Section */}
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 border-b pb-2">Latest News</h2>

          {newsLoading ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <FaSpinner className="animate-spin text-indigo-600 text-3xl mx-auto mb-4" />
              <p className="text-gray-600">Loading news...</p>
            </div>
          ) : newsError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-4" />
              <p className="text-red-700 mb-4">{newsError}</p>
              <button
                onClick={fetchNews}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="bg-gray-50 rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-600">
                {searchTerm ? 'No news found matching your search.' : 'No news available at the moment.'}
              </p>
            </div>
          ) : (
            <div className="relative" ref={newsRef}>
              <div className="overflow-hidden rounded-xl shadow-lg">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${activeNewsIndex * 100}%)` }}
                >
                  {filteredNews.map((news) => (
                    <div key={news.id} className="w-full flex-shrink-0">
                      <div className="bg-white">
                        {news.image && (
                          <img
  src={news.image || "http://localhost:3000/default-news.jpg"}
  alt={news.title}
  className="w-full h-48 object-cover rounded-t-lg"
  onError={(e) => (e.target.src = "http://localhost:3000/default-news.jpg")}
/>
                        )}
                        <div className="p-6">
                          <h3 className="text-2xl font-semibold text-indigo-800 mb-2">{news.title}</h3>
                          <p className="text-gray-600 mb-4">{news.excerpt}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                              {formatDate(news.publishedAt)}
                            </span>
                            {news.url ? (
  <a
    href={news.url}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 font-medium shadow-md"
  >
    Read More
  </a>
) : (
  <button
    className="bg-indigo-600 text-white px-6 py-2 rounded-lg opacity-50 cursor-not-allowed"
    disabled
  >
    Read More
  </button>
)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Navigation Buttons */}
              {filteredNews.length > 1 && (
                <>
                  <button
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 text-indigo-600 rounded-full p-2 shadow-xl focus:outline-none hover:bg-white transition"
                    onClick={handlePrevNews}
                    aria-label="Previous news"
                  >
                    <FiChevronLeft className="text-2xl" />
                  </button>
                  <button
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 text-indigo-600 rounded-full p-2 shadow-xl focus:outline-none hover:bg-white transition"
                    onClick={handleNextNews}
                    aria-label="Next news"
                  >
                    <FiChevronRight className="text-2xl" />
                  </button>
                </>
              )}

              {/* Carousel Indicators */}
              {filteredNews.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {filteredNews.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition ${
                        index === activeNewsIndex ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                      onClick={() => setActiveNewsIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Events Section */}
        <div className="lg:w-1/2">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 border-b pb-2">Upcoming Events</h2>

          {eventsLoading ? (
            <div className="bg-white rounded-lg shadow-xl p-8 text-center">
              <FaSpinner className="animate-spin text-indigo-600 text-3xl mx-auto mb-4" />
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : eventsError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
              <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-4" />
              <p className="text-red-700 mb-4">{eventsError}</p>
              <button
                onClick={fetchEvents}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-gray-50 rounded-lg shadow-xl p-8 text-center">
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No events found matching your search.' : 'No upcoming events at the moment.'}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {filteredEvents.slice(0, visibleEventsCount).map((event) => (
                  <div key={event.id} className="bg-white rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 border-l-4 border-cyan-500">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                      <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full">
                        {formatEventType(event.eventType)}
                      </span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-2 text-sm">
                      <IoCalendarOutline className="mr-2 text-cyan-600" />
                      <span>{formatDate(event.date)}</span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4 text-sm">
                      <IoLocationOutline className="mr-2 text-cyan-600" />
                      <span>{event.venue}</span>
                    </div>

                    <p className="text-gray-700 mb-4 text-sm">{event.description}</p>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Organized by {event.organizer.name}
                      </span>
                      <button
  onClick={() => navigate(`/events/${event.id}`)}
  className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors duration-300 font-medium shadow-md"
>
  View Details / Register
</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {filteredEvents.length > visibleEventsCount && (
                <div className="text-center mt-6">
                  <button
                    className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-6 py-2 rounded-full hover:bg-indigo-100 transition-colors duration-300 font-semibold"
                    onClick={() => setVisibleEventsCount(prevCount => prevCount + 6)}
                  >
                    Load More Events ({filteredEvents.length - visibleEventsCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsEvents;