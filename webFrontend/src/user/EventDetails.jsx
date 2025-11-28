// src/user/EventDetails.jsx - Updated banner button display
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  IoCalendarOutline, 
  IoLocationOutline, 
  IoPersonOutline, 
  IoTimeOutline,
  IoMailOutline,
  IoPeopleOutline,
  IoCashOutline,
  IoCheckmarkCircleOutline,
  IoPricetagOutline,
  IoTrashOutline
} from "react-icons/io5";
import { FaSpinner, FaExternalLinkAlt, FaUser, FaUsers } from "react-icons/fa";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canDelete, setCanDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch event details
        const eventResponse = await axios.get(`http://localhost:3000/api/events/${id}`, {
          withCredentials: true,
        });
        setEvent(eventResponse.data.event);

        // Check if user can delete this event
        try {
          const ownershipResponse = await axios.get(
            `http://localhost:3000/api/events/user/check-ownership/${id}`, 
            { withCredentials: true }
          );
          setCanDelete(ownershipResponse.data.canDelete);
        } catch {
          setCanDelete(false);
        }
      } catch (err) {
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id]);

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
    try {
      setIsDeleting(true);
      await axios.delete(`http://localhost:3000/api/events/${id}`, { withCredentials: true });
      alert(`Event "${event.title}" has been deleted successfully!`);
      navigate('/news&events');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete event. Please try again.');
      setDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatEventType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const formatRole = (role) => {
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-indigo-600 text-4xl mx-auto mb-4" />
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-red-600 text-lg font-medium mb-4">{error || "Event not found"}</p>
        <Link
          to="/news&events"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          to="/news&events"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 transition"
        >
          ← Back to Events
        </Link>

        {/* Show Banner View Button Only If bannerImage Exists */}
        {event.bannerImage && (
          <div className="mb-6">
            <button
              onClick={() => window.open(event.bannerImage, '_blank', 'noopener,noreferrer')}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow inline-flex items-center gap-2"
              aria-label="View Event Banner"
            >
              View Event Banner <FaExternalLinkAlt />
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <span className="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full mb-3">
                  {formatEventType(event.eventType)}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
              </div>

              {/* Delete Button */}
              {canDelete && (
                <div className="ml-4">
                  {!deleteConfirm ? (
                    <button
                      onClick={handleDelete}
                      className="bg-red-500/20 hover:bg-red-500/30 text-white border border-red-300 px-4 py-2 rounded-lg transition flex items-center gap-2"
                      title="Delete Event"
                    >
                      <IoTrashOutline />
                      Delete
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                      >
                        {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(false)}
                        className="bg-gray-500/20 hover:bg-gray-500/30 text-white border border-gray-300 px-4 py-2 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-indigo-100">
              <div className="flex items-center">
                <IoCalendarOutline className="mr-3 text-xl" />
                <div>
                  <p className="text-xs opacity-80">Date</p>
                  <p className="font-semibold">{formatDate(event.date)}</p>
                </div>
              </div>

              {event.time && (
                <div className="flex items-center">
                  <IoTimeOutline className="mr-3 text-xl" />
                  <div>
                    <p className="text-xs opacity-80">Time</p>
                    <p className="font-semibold">{event.time}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <IoLocationOutline className="mr-3 text-xl" />
                <div>
                  <p className="text-xs opacity-80">Venue</p>
                  <p className="font-semibold">{event.venue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Event</h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div className="space-y-6">
                {event.speakerName && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <FaUser className="mr-2" />
                      Featured Speaker
                    </h3>
                    <p className="text-blue-700 font-medium">{event.speakerName}</p>
                    {event.speakerDetails && (
                      <p className="text-blue-600 text-sm mt-1">{event.speakerDetails}</p>
                    )}
                  </div>
                )}

                {event.eligibility && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <IoCheckmarkCircleOutline className="mr-2 text-green-600" />
                      Eligibility
                    </h3>
                    <p className="text-gray-600">{event.eligibility}</p>
                  </div>
                )}

                {event.tags && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <IoPricetagOutline className="mr-2 text-purple-600" />
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.split(',').map((tag, index) => (
                        <span
                          key={index}
                          className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {(event.maxParticipants || event.entryFee) && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h3 className="font-semibold text-gray-800">Event Details</h3>

                    {event.maxParticipants && (
                      <div className="flex items-center text-gray-600">
                        <IoPeopleOutline className="mr-3 text-blue-600" />
                        <span><strong>Max Participants:</strong> {event.maxParticipants}</span>
                      </div>
                    )}

                    {event.entryFee && (
                      <div className="flex items-center text-gray-600">
                        <IoCashOutline className="mr-3 text-green-600" />
                        <span><strong>Entry Fee:</strong> ₹{event.entryFee}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Contact Information */}
                {(event.contactInfo || event.contactEmail || event.organizer) && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <h3 className="font-semibold text-indigo-800 mb-3">Contact Information</h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-indigo-700">
                        <IoPersonOutline className="mr-2" />
                        <span>Organized by: <strong>{event.organizer?.name}</strong> ({formatRole(event.organizer?.role)})</span>
                      </div>

                      {event.contactInfo && (
                        <div className="flex items-start text-indigo-600">
                          <FaUsers className="mr-2 mt-0.5 text-xs" />
                          <span>{event.contactInfo}</span>
                        </div>
                      )}

                      {event.contactEmail && (
                        <div className="flex items-center text-indigo-600">
                          <IoMailOutline className="mr-2" />
                          <a 
                            href={`mailto:${event.contactEmail}`}
                            className="hover:underline"
                          >
                            {event.contactEmail}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6">
              <div className="flex flex-wrap gap-4">
                {event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition inline-flex items-center gap-2 shadow-md font-semibold"
                  >
                    Register Now <FaExternalLinkAlt className="text-sm" />
                  </a>
                )}

                {event.externalLink && (
                  <a
                    href={event.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition inline-flex items-center gap-2 shadow-md font-semibold"
                  >
                    Join Community <FaExternalLinkAlt className="text-sm" />
                  </a>
                )}

                <Link
                  to="/news&events"
                  className="bg-gray-100 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition inline-flex items-center gap-2 shadow-md font-semibold"
                >
                  Back to Events
                </Link>
              </div>
            </div>

            {/* Simplified Event Metadata */}
            <div className="border-t mt-6 pt-6 text-sm text-gray-500">
              <p>
                Created by <strong>{event.organizer?.name}</strong> on {formatDate(event.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
